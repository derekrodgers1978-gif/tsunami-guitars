const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const heroPath = path.join(siteDir, 'images', 'tsunami-hero.webp');
if (!fs.existsSync(heroPath)) throw new Error('Direct hero image is missing from published site folder.');
const hero = fs.readFileSync(heroPath);
if (hero.length < 1000 || hero.slice(0,4).toString('ascii') !== 'RIFF' || hero.slice(8,12).toString('ascii') !== 'WEBP') throw new Error('Direct hero file is not a valid WebP image.');

const indexPath = path.join(siteDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Do not rely on separately injected hero stylesheets. Render the hero artwork
// directly from the existing published hero asset and leave the rest of the page alone.
html = html.replace(/\s*<link rel="stylesheet" href="\/hero-effects\.css">\s*/g, '\n');
html = html.replace(/\s*<link rel="stylesheet" href="\/hero-display-fix\.css">\s*/g, '\n');

html = html.replace(
  /background-image:\s*url\(["']?images\/3amigosonthecouch\.png["']?\);/,
  'background-image: url("images/tsunami-hero.webp");'
);

const directHeroStyle = `
<style id="tsunami-direct-hero">
#home.hero {
  min-height: 0 !important;
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 3 / 2 !important;
  display: block !important;
  position: relative !important;
  overflow: hidden !important;
  padding: 0 !important;
  background: #000 !important;
}
#home .hero-bg {
  position: absolute !important;
  inset: 0 !important;
  background-image: url("images/tsunami-hero.webp") !important;
  background-size: 100% 100% !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
#home .hero-bg::after { display: none !important; }
#home .hero-left,
#home .hero-right { display: none !important; }
</style>`;

html = html.replace(/\s*<style id="tsunami-direct-hero">[\s\S]*?<\/style>\s*/g, '\n');
html = html.replace('</head>', `${directHeroStyle}\n</head>`);
fs.writeFileSync(indexPath, html);

console.log(`Direct hero verified and rendered: ${hero.length} bytes`);
