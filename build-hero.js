const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'tsunami-guitars', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const brokenStart = html.indexOf("\n      \n'Josefin Sans',sans-serif;font-size:1.4rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(200,50,50,0.9);\">SOLD</span>");
const card8Start = html.indexOf("      <!-- SOLD CARD 8: 80's Greco Super Real LP -->", brokenStart);

if (brokenStart === -1 || card8Start === -1) {
  throw new Error('Could not locate malformed Navigator Esparto sold card');
}

const fixedEsparto = `

      <!-- SOLD CARD 7: 70's Navigator Esparto -->
      <div style="border:1px solid rgba(201,162,74,0.1);background:#0e0b08;overflow:hidden;opacity:0.75;">
        <div style="position:relative;overflow:hidden;background:#0e0b08;">
          <img src="images/sold07.jpg" style="width:100%;height:240px;object-fit:cover;object-position:center;background:#0e0b08;filter:grayscale(30%);">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
            <div style="border:3px solid rgba(180,30,30,0.85);padding:0.4rem 1.4rem;transform:rotate(-15deg);background:rgba(14,11,8,0.4);">
              <span style="font-family:'Josefin Sans',sans-serif;font-size:1.4rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(200,50,50,0.9);">SOLD</span>
            </div>
          </div>
        </div>
        <div style="padding:1.2rem;">
          <p style="font-family:'Josefin Sans',sans-serif;font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);opacity:0.5;margin-bottom:0.3rem;">1970s · Made in Japan · ESP</p>
          <p style="font-family:'Shippori Mincho',serif;font-size:1.1rem;font-weight:700;color:var(--white);margin-bottom:0.2rem;">Navigator Esparto</p>
          <p style="font-family:'Josefin Sans',sans-serif;font-size:0.6rem;letter-spacing:0.1em;color:var(--gold);opacity:0.6;">Sunburst · Stratocaster Style</p>
        </div>
      </div>

`;

html = html.slice(0, brokenStart) + fixedEsparto + html.slice(card8Start);
fs.writeFileSync(indexPath, html);

console.log('Navigator Esparto sold card repaired; no other page content changed.');
