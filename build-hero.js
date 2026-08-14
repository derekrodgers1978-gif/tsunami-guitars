const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const heroPath = path.join(siteDir, 'images', 'tsunami-hero.webp');

if (!fs.existsSync(heroPath)) {
  throw new Error('Hero image is missing: tsunami-guitars/images/tsunami-hero.webp');
}

const hero = fs.readFileSync(heroPath);
if (
  hero.length < 1000 ||
  hero.slice(0, 4).toString('ascii') !== 'RIFF' ||
  hero.slice(8, 12).toString('ascii') !== 'WEBP'
) {
  throw new Error('tsunami-hero.webp is not a valid WebP image');
}

const indexPath = path.join(siteDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove every previous hero patch injected by earlier attempts.
html = html.replace(/\s*<link rel="stylesheet" href="\/hero-effects\.css(?:\?[^\"]*)?">\s*/g, '\n');
html = html.replace(/\s*<link rel="stylesheet" href="\/hero-display-fix\.css(?:\?[^\"]*)?">\s*/g, '\n');
html = html.replace(/\s*<style id="tsunami-direct-hero">[\s\S]*?<\/style>\s*/g, '\n');

// Replace ONLY the homepage hero section with one normal image element.
// Nothing before or after the hero is changed.
const heroStart = html.indexOf('<!-- HERO -->');
const marqueeStart = html.indexOf('<!-- MARQUEE -->');

if (heroStart === -1 || marqueeStart === -1 || marqueeStart <= heroStart) {
  throw new Error('Could not locate the existing HERO/MARQUEE boundaries in index.html');
}

const plainHero = `<!-- HERO -->
<section id="home" style="margin:0;padding:0;width:100%;background:#000;overflow:hidden;line-height:0;">
  <img
    src="/images/tsunami-hero.webp?v=20260814-plain"
    alt="Tsunami Guitars"
    width="1536"
    height="1024"
    style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;"
  >
</section>

`;

html = html.slice(0, heroStart) + plainHero + html.slice(marqueeStart);
fs.writeFileSync(indexPath, html);

console.log(`Plain hero image installed: ${hero.length} bytes`);
