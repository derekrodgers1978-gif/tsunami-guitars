import fs from 'node:fs';

let page = fs.readFileSync('index.html', 'utf8');
const start = page.indexOf('<!-- GUITAR 13: Crews Maniac Sound KTR ST60 Sunburst -->');
const end = page.indexOf('<!-- GUITAR 14:', start);
if (start < 0 || end < 0) throw new Error('Crews inventory card not found');
page = page.slice(0, start) + page.slice(end);

const soldCard = fs.readFileSync('sold-crews-card.html', 'utf8').trim();
const soldGrid = '<!-- Sold Grid -->\n    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2rem;">';
if (!page.includes('<!-- SOLD CARD: Crews Maniac Sound KTR ST60 -->')) {
  if (!page.includes(soldGrid)) throw new Error('Sold grid not found');
  page = page.replace(soldGrid, soldGrid + '\n\n' + soldCard);
}
page = page.replace(/\n10\. Crews Maniac Sound KTR ST60[^\n]*/, '');
fs.writeFileSync('index.html', page);

const data = JSON.parse(fs.readFileSync('guitars.json', 'utf8'));
const guitar = data.guitars.find(g => g.id === 'crews-maniac-sound-ktr-st60-sunburst');
if (!guitar) throw new Error('Crews guitar data not found');
guitar.status = 'sold';
fs.writeFileSync('guitars.json', JSON.stringify(data, null, 2) + '\n');
