from pathlib import Path
import base64

root = Path(__file__).resolve().parents[1]

# Rebuild the exact selected hero artwork from the staged chunks.
payload = ''.join(
    (root / '.hero-chunks' / f'part{i}.txt').read_text(encoding='utf-8').strip()
    for i in (1, 2, 3)
)
(root / 'images' / 'tsunami-hero.webp').write_bytes(base64.b64decode(payload))

index_path = root / 'index.html'
html = index_path.read_text(encoding='utf-8')

marker = '/* TSUNAMI HERO 2026 */'
if marker not in html:
    css = r'''
  /* TSUNAMI HERO 2026 */
  #page-bg { z-index: -3 !important; }

  .site-dragon-bg {
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    opacity: 0.065;
    background-image: url("images/img_02.jpg"), url("images/img_02.jpg");
    background-repeat: no-repeat, no-repeat;
    background-position: calc(100% + 300px) 24vh, -340px 145vh;
    background-size: 920px 920px, 860px 860px;
    filter: sepia(1) saturate(0.85) brightness(0.58) contrast(1.15);
    mix-blend-mode: screen;
  }

  .reverb, .brands, .why, .about, .contact, .merch,
  #sold, #why-buy, #blog, #insider, #guitar-santa, #instagram {
    background-color: rgba(14,11,8,0.965) !important;
  }

  #home.hero {
    min-height: 620px;
    height: clamp(620px, 66.666vw, 1024px);
    display: block;
    position: relative;
    overflow: hidden;
    background: #0e0b08;
  }

  #home .hero-bg {
    position: absolute;
    inset: 0;
    background-image: url("images/tsunami-hero.webp") !important;
    background-size: cover !important;
    background-position: center top !important;
    background-repeat: no-repeat !important;
    z-index: 0;
    transform: scale(1.002);
  }

  /* Hide the baked navigation strip in the artwork so the real site nav stays usable. */
  #home .hero-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      #0e0b08 0 92px,
      rgba(14,11,8,0.06) 93px 78%,
      rgba(14,11,8,0.30) 100%
    ) !important;
    pointer-events: none;
  }

  /* The selected artwork already contains the hero copy and buttons. */
  #home .hero-left,
  #home .hero-right { display: none !important; }

  /* Slow water shimmer across the lower-right wave area. */
  #home::before {
    content: '';
    position: absolute;
    right: -8%;
    bottom: -7%;
    width: 70%;
    height: 48%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.34;
    background:
      radial-gradient(ellipse at 32% 88%, transparent 0 47%, rgba(232,200,120,0.14) 48% 49%, transparent 50%),
      radial-gradient(ellipse at 60% 78%, transparent 0 52%, rgba(245,232,192,0.10) 53% 54%, transparent 55%),
      radial-gradient(ellipse at 82% 92%, transparent 0 44%, rgba(201,162,74,0.13) 45% 46%, transparent 47%);
    filter: blur(0.35px);
    animation: tgWaveDrift 10s ease-in-out infinite alternate;
    mix-blend-mode: screen;
  }

  /* Fine bubbles rising from the wave area. */
  #home::after {
    content: '';
    position: absolute;
    right: 5%;
    bottom: 6%;
    width: 52%;
    height: 42%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.28;
    background-image:
      radial-gradient(circle, rgba(245,232,192,0.40) 0 1px, rgba(201,162,74,0.12) 2px, transparent 3px),
      radial-gradient(circle, rgba(245,232,192,0.30) 0 1.5px, transparent 2.8px),
      radial-gradient(circle, rgba(201,162,74,0.34) 0 1px, transparent 2.5px);
    background-size: 130px 150px, 185px 210px, 240px 190px;
    background-position: 10px 20px, 70px 110px, 140px 45px;
    animation: tgBubbles 14s linear infinite;
    mix-blend-mode: screen;
  }

  @keyframes tgWaveDrift {
    0%   { transform: translate3d(-1.5%, 2%, 0) scale(1.01); opacity: 0.22; }
    50%  { transform: translate3d(1%, -1%, 0) scale(1.045); opacity: 0.38; }
    100% { transform: translate3d(2%, 0.5%, 0) scale(1.02); opacity: 0.28; }
  }

  @keyframes tgBubbles {
    0%   { transform: translate3d(0, 45px, 0); background-position: 10px 20px, 70px 110px, 140px 45px; }
    50%  { transform: translate3d(8px, -30px, 0); background-position: 30px -35px, 95px 35px, 165px -15px; }
    100% { transform: translate3d(-5px, -110px, 0); background-position: 50px -100px, 120px -55px, 190px -80px; }
  }

  .hero-hotspots {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }
  .hero-hotspot {
    position: absolute;
    pointer-events: auto;
    display: block;
    border: 1px solid transparent;
    transition: border-color .18s, background .18s;
  }
  .hero-hotspot:hover {
    border-color: rgba(232,200,120,.4);
    background: rgba(201,162,74,.035);
  }
  .hero-hotspot-products { left: 4.1%; top: 70.5%; width: 17.3%; height: 5.8%; }
  .hero-hotspot-arrivals { left: 22.4%; top: 70.5%; width: 14.3%; height: 5.8%; }

  .nav-brand .nav-logo {
    display: block;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    #home.hero { min-height: 520px; height: 72vh; }
    #home .hero-bg { background-size: cover !important; background-position: 37% center !important; }
    #home .hero-bg::after {
      background: linear-gradient(to bottom, #0e0b08 0 72px, rgba(14,11,8,.04) 73px 78%, rgba(14,11,8,.3) 100%) !important;
    }
    .hero-hotspots { display: none; }
    .site-dragon-bg {
      opacity: .045;
      background-size: 640px 640px, 600px 600px;
      background-position: calc(100% + 250px) 32vh, -260px 150vh;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #home::before, #home::after { animation: none !important; }
  }
'''
    target = '</style>\n</head>'
    if target not in html:
        raise SystemExit('Main style closing marker not found')
    html = html.replace(target, css + '\n</style>\n</head>', 1)

# Put a very faint oversized dragon behind the rest of the site.
dragon_div = '<div class="site-dragon-bg" aria-hidden="true"></div>'
if dragon_div not in html:
    page_bg = '<div id="page-bg" style="position:fixed;inset:0;background:#0e0b08;z-index:-1;"></div>'
    if page_bg not in html:
        raise SystemExit('page-bg marker not found')
    html = html.replace(page_bg, page_bg + '\n' + dragon_div, 1)

# Put the existing Tsunami dragon medallion beside the live site title in nav.
if 'class="nav-logo"' not in html:
    old = '<a href="#" class="nav-brand">\n    <div class="nav-brand-text">'
    new = '<a href="#" class="nav-brand">\n    <img src="images/img_02.jpg" class="nav-logo" alt="Tsunami Guitars">\n    <div class="nav-brand-text">'
    if old not in html:
        raise SystemExit('nav brand marker not found')
    html = html.replace(old, new, 1)

# Preserve working links over the two buttons that are printed into the selected hero image.
if 'hero-hotspot-products' not in html:
    hero_bg = '  <div class="hero-bg"></div>'
    if hero_bg not in html:
        raise SystemExit('hero background marker not found')
    hotspots = '''<div class="hero-hotspots" aria-label="Hero shortcuts">
    <a class="hero-hotspot hero-hotspot-products" href="#products" aria-label="Browse guitars"></a>
    <a class="hero-hotspot hero-hotspot-arrivals" href="#products" aria-label="New arrivals"></a>
  </div>'''
    html = html.replace(hero_bg, hero_bg + '\n  ' + hotspots, 1)

index_path.write_text(html, encoding='utf-8')
print('Tsunami hero applied.')
