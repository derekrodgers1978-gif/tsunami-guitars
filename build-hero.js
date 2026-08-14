const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const chunkDir = path.join(siteDir, '.hero-chunks');
const heroPath = path.join(siteDir, 'images', 'tsunami-hero.webp');
const chunkFiles = ['part1.txt', 'part2.txt', 'part3.txt'];

// Rebuild the selected hero from the original staged base64 chunks on every Netlify deploy.
let encoded = chunkFiles
  .map(name => fs.readFileSync(path.join(chunkDir, name), 'utf8'))
  .join('')
  .replace(/\s+/g, '');
encoded += '='.repeat((4 - (encoded.length % 4)) % 4);

const hero = Buffer.from(encoded, 'base64');
if (
  hero.length < 1000 ||
  hero.slice(0, 4).toString('ascii') !== 'RIFF' ||
  hero.slice(8, 12).toString('ascii') !== 'WEBP'
) {
  throw new Error('Rebuilt hero data is not a valid WebP image');
}

fs.mkdirSync(path.dirname(heroPath), { recursive: true });
fs.writeFileSync(heroPath, hero);

const indexPath = path.join(siteDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove earlier hero-only patch links/styles so nothing can override the plain image.
html = html.replace(/\s*<link rel="stylesheet" href="\/hero-effects\.css(?:\?[^\"]*)?">\s*/g, '\n');
html = html.replace(/\s*<link rel="stylesheet" href="\/hero-display-fix\.css(?:\?[^\"]*)?">\s*/g, '\n');
html = html.replace(/\s*<style id="tsunami-direct-hero">[\s\S]*?<\/style>\s*/g, '\n');

const heroStart = html.indexOf('<!-- HERO -->');
const marqueeStart = html.indexOf('<!-- MARQUEE -->');
if (heroStart === -1 || marqueeStart === -1 || marqueeStart <= heroStart) {
  throw new Error('Could not locate HERO/MARQUEE boundaries in index.html');
}

const plainHero = `<!-- HERO -->
<section id="home" style="margin:0;padding:0;width:100%;background:#000;overflow:hidden;line-height:0;">
  <img
    src="/images/tsunami-hero.webp?v=20260814-rebuilt"
    alt="Tsunami Guitars"
    width="1536"
    height="1024"
    style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;"
  >
</section>

`;

html = html.slice(0, heroStart) + plainHero + html.slice(marqueeStart);
fs.writeFileSync(indexPath, html);

console.log(`Hero rebuilt from chunks and installed: ${hero.length} bytes`);
