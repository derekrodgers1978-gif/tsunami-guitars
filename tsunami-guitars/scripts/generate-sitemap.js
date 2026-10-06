const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const baseUrl = "https://tsunamiguitars.com";
const catalog = JSON.parse(fs.readFileSync(path.join(siteRoot, "guitars.json"), "utf8"));
const corePages = [
  "/", "/inventory.html", "/sold.html", "/about.html", "/blog.html",
  "/merch.html", "/contact.html", "/collection/",
  "/blog/the-guitar-world-two-directions/",
  "/blog/are-japanese-guitars-going-up-in-value/"
];
const availableGuitars = catalog.guitars
  .filter((guitar) => guitar.status === "available")
  .map((guitar) => `/guitar.html?id=${encodeURIComponent(guitar.id)}`);
const urls = [...new Set([...corePages, ...availableGuitars])];
const xmlEscape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${xmlEscape(baseUrl + url)}</loc></url>`),
  '</urlset>',
  ''
].join("\n");
fs.writeFileSync(path.join(siteRoot, "sitemap.xml"), sitemap);
