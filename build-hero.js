const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const heroPath = path.join(siteDir, 'images', 'tsunami-hero.webp');
if (!fs.existsSync(heroPath)) throw new Error('Direct hero image is missing from published site folder.');
const hero = fs.readFileSync(heroPath);
if (hero.length < 1000 || hero.slice(0,4).toString('ascii') !== 'RIFF' || hero.slice(8,12).toString('ascii') !== 'WEBP') throw new Error('Direct hero file is not a valid WebP image.');

const indexPath = path.join(siteDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const cssLink = '<link rel="stylesheet" href="/hero-effects.css">';
if (!html.includes('/hero-effects.css')) {
  html = html.replace('</head>', `${cssLink}\n</head>`);
  fs.writeFileSync(indexPath, html);
}
console.log(`Direct hero verified: ${hero.length} bytes`);
