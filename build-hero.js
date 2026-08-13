const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, 'tsunami-guitars');
const chunkDir = path.join(siteDir, '.hero-chunks');
const chunkFiles = ['part1.txt', 'part2.txt', 'part3.txt'];

let encoded = chunkFiles
  .map(name => fs.readFileSync(path.join(chunkDir, name), 'utf8'))
  .join('')
  .replace(/\s+/g, '');

encoded += '='.repeat((4 - (encoded.length % 4)) % 4);
const hero = Buffer.from(encoded, 'base64');

if (hero.length < 1000 || hero.slice(0, 4).toString('ascii') !== 'RIFF' || hero.slice(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Hero data did not decode to a valid WebP image.');
}

const imagePath = path.join(siteDir, 'images', 'tsunami-hero.webp');
fs.writeFileSync(imagePath, hero);

const indexPath = path.join(siteDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const cssLink = '<link rel="stylesheet" href="/hero-effects.css">';
if (!html.includes('/hero-effects.css')) {
  html = html.replace('</head>', `${cssLink}\n</head>`);
  fs.writeFileSync(indexPath, html);
}

console.log(`Hero ready: ${hero.length} bytes`);
