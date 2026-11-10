// Render crawlable guitar details at the edge without changing the existing interactive gallery or checkout.
// Both legacy ?id= links and clean /guitars/:id/ links receive the same canonical metadata.
export default async (request, context) => {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/guitars\/([^/]+)\/?$/);
  let id = url.pathname === "/guitar" || url.pathname === "/guitar.html"
    ? url.searchParams.get("id") : match?.[1];
  if (!id) return context.next();
  try { id = decodeURIComponent(id); } catch { return context.next(); }
  if (id === "navigator-ctm-320-jet-black-2004") {
    return Response.redirect(new URL("/guitars/navigator-nlp-320-ctm-black-beauty-2004/", url.origin), 301);
  }
  const origin = url.origin;
  const [catalogResponse, pageResponse] = await Promise.all([
    fetch(new URL("/guitars.json", origin)),
    context.next()
  ]);
  if (!catalogResponse.ok || !pageResponse.ok) return pageResponse;
  const catalog = await catalogResponse.json();
  const guitar = catalog.guitars?.find((item) => item.id === id);
  if (!guitar) return new Response("Guitar not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const canonical = origin + "/guitars/" + encodeURIComponent(guitar.id) + "/";
  const title = guitar.meta_title || guitar.title + " | Tsunami Guitars";
  const description = guitar.meta_desc || guitar.description || "";
  const imageUrls = (guitar.images || []).map((path) => origin + "/images/" + String(path).replace(/^\/+/, ""));
  const product = {
    "@context": "https://schema.org", "@type": "Product",
    name: guitar.title, description: guitar.description || description,
    image: imageUrls, sku: guitar.id, url: canonical,
    brand: { "@type": "Brand", name: guitar.brand },
    ...(guitar.status === "available" && Number.isFinite(Number(guitar.price_num)) ? {
      offers: { "@type": "Offer", url: canonical, priceCurrency: "CAD",
        price: String(guitar.price_num), availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/UsedCondition",
        seller: { "@type": "Organization", name: "Tsunami Guitars", url: origin } }
    } : {})
  };
  let html = await pageResponse.text();
  html = html.replace(/<title id="page-title">[\s\S]*?<\/title>/, '<title id="page-title">' + esc(title) + '</title>');
  const setMeta = (elementId, value) => {
    const pattern = new RegExp('(<meta\\s+[^>]*id="' + elementId + '"[^>]*content=")[^"]*(")', 'i');
    html = html.replace(pattern, (_, before, after) => before + esc(value) + after);
  };
  setMeta("meta-desc", description);
  setMeta("og-title", title);
  setMeta("og-desc", description);
  setMeta("og-image", imageUrls[0] || "");
  html = html.replace(/(<link rel="canonical" id="canonical" href=")[^"]*(")/, (_, a, b) => a + esc(canonical) + b);
  const jsonLd = JSON.stringify(product).replace(/</g, "\\u003c");
  html = html.replace("</head>", '<script id="product-jsonld" type="application/ld+json">' + jsonLd + '</script>\n</head>');
  const specs = (guitar.specs || []).map((pair) => '<dt>' + esc(pair[0]) + '</dt><dd>' + esc(pair[1]) + '</dd>').join("");
  const content = '<article class="guitar-page" aria-label="Guitar details">' +
    '<div><img style="width:100%;height:auto;object-fit:contain" src="' + esc(imageUrls[0] || "") + '" alt="' + esc(guitar.title) + '"></div>' +
    '<div class="info"><h1 class="guitar-title">' + esc(guitar.title) + '</h1>' +
    '<p class="description">' + esc(guitar.description || description) + '</p>' +
    '<dl class="specs">' + specs + '</dl>' +
    (guitar.status === "available" ? '<p class="price">' + esc(guitar.price || "CA$" + guitar.price_num) + '</p>' : '<p>Sold</p>') +
    '</div></article>';
  html = html.replace('<div class="state-screen"><p>Loading…</p></div>', content);
  // The existing JS hydrates the full gallery and checkout after fetching guitars.json.
  return new Response(html, { status: 200, headers: {
    "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate",
    "x-robots-tag": "index, follow"
  } });
};
