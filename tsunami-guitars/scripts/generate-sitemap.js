const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const baseUrl = "https://tsunamiguitars.com";
const catalog = JSON.parse(fs.readFileSync(path.join(siteRoot, "guitars.json"), "utf8"));
const template = fs.readFileSync(path.join(siteRoot, "guitar.html"), "utf8");
const corePages = [
  "/", "/inventory", "/sold", "/about", "/blog",
  "/merch", "/contact", "/collection/",
  "/blog/the-guitar-world-two-directions/",
  "/blog/are-japanese-guitars-going-up-in-value/"
];
const products = catalog.guitars.filter((guitar) => guitar.status === "available" || guitar.status === "sold");
const guitarPages = products.map((guitar) => "/guitars/" + encodeURIComponent(guitar.id) + "/");
const urls = [...new Set([...corePages, ...guitarPages])];
const xmlEscape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const htmlEscape = (value) => String(value == null ? "" : value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const imageUrl = (image) => baseUrl + "/images/" + String(image).split("/").map(encodeURIComponent).join("/");
const pageUrl = (guitar) => baseUrl + "/guitars/" + encodeURIComponent(guitar.id) + "/";

function productSchema(guitar) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": guitar.year + " " + guitar.brand + " " + guitar.model,
    "description": guitar.description,
    "image": (guitar.images || []).map(imageUrl),
    "sku": guitar.id,
    "url": pageUrl(guitar),
    "category": "Musical Instruments > Guitars",
    "brand": { "@type": "Brand", "name": guitar.brand },
    ...(guitar.status === "available" ? {
      "offers": {
        "@type": "Offer",
        "url": pageUrl(guitar),
        "priceCurrency": "CAD",
        "price": String(guitar.price_num),
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/UsedCondition",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "CAD" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "CA" }
        },
        "seller": {
          "@type": "Organization",
          "name": "Tsunami Guitars",
          "url": baseUrl
        }
      }
    } : {})
  };
}

function staticProductContent(guitar) {
  const firstImage = guitar.images && guitar.images[0] ? imageUrl(guitar.images[0]) : "";
  const status = guitar.status === "available" ? "Available" : "Sold";
  const price = guitar.status === "available" ? guitar.price : "Sold";
  const image = firstImage
    ? '<div class="gallery"><div class="main-wrap" style="cursor:default"><img src="' + htmlEscape(firstImage) + '" alt="' + htmlEscape(guitar.title) + ' — ' + htmlEscape(guitar.subtitle) + '" loading="eager"></div></div>'
    : "";
  const specs = (guitar.specs || []).map((spec) =>
    '<div class="spec-row"><span class="spec-key">' + htmlEscape(spec[0]) + '</span><span class="spec-val">' + htmlEscape(spec[1]) + '</span></div>'
  ).join("");
  return '<main class="guitar-page">' + image +
    '<div class="info">' +
    '<p class="eyebrow">' + htmlEscape(guitar.eyebrow || status) + '</p>' +
    '<div><h1 class="guitar-title">' + htmlEscape(guitar.title) + '</h1>' +
    '<p class="guitar-sub">' + htmlEscape(guitar.subtitle) + '</p></div>' +
    '<p class="description">' + htmlEscape(guitar.description) + '</p>' +
    '<div class="price-wrap"><div><p class="price-label">' + status + '</p>' +
    '<p class="price">' + htmlEscape(price) + '</p>' +
    (guitar.status === "available" ? '<p class="shipping-note">Free insured shipping within Canada. International shipping is quoted before dispatch.</p>' : "") +
    '</div></div><div class="specs">' + specs + '</div></div></main>';
}

function renderProductPage(guitar) {
  let html = template;
  const title = guitar.meta_title || (guitar.title + " | Tsunami Guitars");
  const description = guitar.meta_desc || guitar.description;
  const image = guitar.images && guitar.images[0] ? imageUrl(guitar.images[0]) : "";
  html = html.replace(/<title id="page-title">[\s\S]*?<\/title>/, '<title id="page-title">' + htmlEscape(title) + '</title>');
  html = html.replace(/<meta name="description" id="meta-desc" content="[^"]*">/, '<meta name="description" id="meta-desc" content="' + htmlEscape(description) + '">');
  html = html.replace(/<meta property="og:title" id="og-title" content="[^"]*">/, '<meta property="og:title" id="og-title" content="' + htmlEscape(title) + '">');
  html = html.replace(/<meta property="og:description" id="og-desc" content="[^"]*">/, '<meta property="og:description" id="og-desc" content="' + htmlEscape(description) + '">');
  html = html.replace(/<meta property="og:image" id="og-image" content="[^"]*">/, '<meta property="og:image" id="og-image" content="' + htmlEscape(image) + '">');
  html = html.replace(/<link rel="canonical" id="canonical" href="[^"]*">/, '<link rel="canonical" id="canonical" href="' + htmlEscape(pageUrl(guitar)) + '">');
  html = html.replace('<div class="state-screen"><p>Loading…</p></div>', staticProductContent(guitar));
  const jsonLd = JSON.stringify(productSchema(guitar)).replace(/</g, "\\u003c");
  html = html.replace("</head>", '<script id="product-jsonld" type="application/ld+json">' + jsonLd + '</script>\n</head>');
  return html;
}

for (const guitar of products) {
  const pageDirectory = path.join(siteRoot, "guitars", encodeURIComponent(guitar.id));
  fs.mkdirSync(pageDirectory, { recursive: true });
  fs.writeFileSync(path.join(pageDirectory, "index.html"), renderProductPage(guitar));
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => "  <url><loc>" + xmlEscape(baseUrl + url) + "</loc></url>"),
  '</urlset>',
  ''
].join("\n");
fs.writeFileSync(path.join(siteRoot, "sitemap.xml"), sitemap);
