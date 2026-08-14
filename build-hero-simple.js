const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const heroPath = path.join(siteDir, 'images', 'tsunami-hero.webp');
const indexPath = path.join(siteDir, 'index.html');

if (!fs.existsSync(heroPath)) throw new Error('Selected hero image is missing.');

let html = fs.readFileSync(indexPath, 'utf8');
const start = html.indexOf('<!-- HERO -->');
const endMarker = '<!-- MARQUEE -->';
const end = html.indexOf(endMarker);
if (start === -1 || end === -1 || end <= start) throw new Error('Hero block markers not found.');

const hero = `<!-- HERO -->\n<section id="home" style="display:block;width:100%;margin:0;padding:0;background:#000;overflow:hidden;">\n  <img src="/images/tsunami-hero.webp?v=20260813-simple" alt="Tsunami Guitars" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;">\n</section>\n\n`;

html = html.slice(0, start) + hero + html.slice(end);
fs.writeFileSync(indexPath, html);
console.log('Simple hero image rendered.');
