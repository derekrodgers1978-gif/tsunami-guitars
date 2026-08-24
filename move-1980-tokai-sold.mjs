import fs from 'node:fs';

const indexPath = 'tsunami-guitars/index.html';
const jsonPath = 'tsunami-guitars/guitars.json';

let html = fs.readFileSync(indexPath, 'utf8');

if (!html.includes('<!-- SOLD CARD: 1980 Tokai LC60 Wine Red -->')) {
  const startMarker = '<!-- GUITAR 16: 1980 Tokai LC60 Wine Red -->';
  const start = html.indexOf(startMarker);
  if (start < 0) throw new Error('1980 Tokai LC60 inventory card not found');

  const after = html.slice(start + startMarker.length);
  const nextMatches = [
    after.indexOf('<!-- GUITAR 17:'),
    after.indexOf('<!-- GUITAR 18:'),
    after.indexOf('<!-- Sold Guitars -->')
  ].filter(n => n >= 0);
  if (!nextMatches.length) throw new Error('Could not find end of 1980 Tokai LC60 inventory card');
  const end = start + startMarker.length + Math.min(...nextMatches);
  html = html.slice(0, start) + html.slice(end);

  const soldGrid = '<!-- Sold Grid -->\n    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2rem;">';
  if (!html.includes(soldGrid)) throw new Error('Sold Grid not found');

  const soldCard = `<!-- Sold Grid -->\n    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2rem;">\n\n      <!-- SOLD CARD: 1980 Tokai LC60 Wine Red -->\n      <div style="border:1px solid rgba(201,162,74,0.1);background:#0e0b08;overflow:hidden;opacity:0.75;">\n        <div style="position:relative;overflow:hidden;background:#0e0b08;">\n          <img src="images/tokairw01.jpg" style="width:100%;height:240px;object-fit:contain;object-position:center;background:#0e0b08;filter:grayscale(30%);">\n          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">\n            <div style="border:3px solid rgba(180,30,30,0.85);padding:0.4rem 1.4rem;transform:rotate(-15deg);background:rgba(14,11,8,0.4);">\n              <span style="font-family:'Josefin Sans',sans-serif;font-size:1.4rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(200,50,50,0.9);">SOLD</span>\n            </div>\n          </div>\n        </div>\n        <div style="padding:1.2rem;">\n          <p style="font-family:'Josefin Sans',sans-serif;font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);opacity:0.5;margin-bottom:0.3rem;">1980 · Made in Japan · Tokai Gakki · Hamamatsu</p>\n          <p style="font-family:'Shippori Mincho',serif;font-size:1.1rem;font-weight:700;color:var(--white);margin-bottom:0.2rem;">Tokai LC60</p>\n          <p style="font-family:'Josefin Sans',sans-serif;font-size:0.6rem;letter-spacing:0.1em;color:var(--gold);opacity:0.6;">Wine Red · All Original · Case Queen</p>\n        </div>\n      </div>`;
  html = html.replace(soldGrid, soldCard);
}

html = html.replace(/\n13\. 1980 Tokai LC60[^\n]*/, '');
fs.writeFileSync(indexPath, html);

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const guitar = data.guitars.find(g => g.id === 'tokai-lc60-wine-red-1980');
if (!guitar) throw new Error('1980 Tokai LC60 JSON record not found');
guitar.status = 'sold';
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');

console.log('1980 Tokai LC60 moved to sold for deployment');
