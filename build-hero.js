const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const heroPath = path.join(siteDir, 'images', 'tsunami-hero.webp');
if (!fs.existsSync(heroPath)) throw new Error('Direct hero image is missing from published site folder.');
const hero = fs.readFileSync(heroPath);
if (hero.length < 1000 || hero.slice(0,4).toString('ascii') !== 'RIFF' || hero.slice(8,12).toString('ascii') !== 'WEBP') throw new Error('Direct hero file is not a valid WebP image.');

const indexPath = path.join(siteDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const cssLinks = [
  '<link rel="stylesheet" href="/hero-effects.css">',
  '<link rel="stylesheet" href="/hero-display-fix.css">'
];
let changed = false;
for (const cssLink of cssLinks) {
  const href = cssLink.match(/href="([^"]+)"/)[1];
  if (!html.includes(href)) {
    html = html.replace('</head>', `${cssLink}\n</head>`);
    changed = true;
  }
}
if (changed) fs.writeFileSync(indexPath, html);
console.log(`Direct hero verified: ${hero.length} bytes`);
