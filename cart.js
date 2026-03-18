(function () {

  /* ============================================================
     TSUNAMI GUITARS — CART & CHECKOUT SYSTEM
     Drop this file into your site and add this to your HTML
     just before </body>:
       <script src="cart.js"></script>
     Then add  data-product="PRODUCT NAME" data-price="30"
     to each Shop Now button.
  ============================================================ */

  const PAYPAL_EMAIL = 'derekrodgers1978@gmail.com';
  const ETRANSFER_EMAIL = 'derekrodgers1978@gmail.com';

  /* ---------- STATE ---------- */
  let cart = [];

  /* ---------- STYLES ---------- */
  const css = `
    :root {
      --tg-bg: #1a1610;
      --tg-surface: #221f18;
      --tg-border: #3a3425;
      --tg-gold: #c8a84b;
      --tg-gold-light: #e8c866;
      --tg-text: #e8d9b0;
      --tg-muted: #6b6050;
      --tg-overlay: rgba(10,8,5,0.85);
      --tg-font: 'Josefin Sans', sans-serif;
      --tg-serif: 'Cormorant Garamond', serif;
    }

    /* CART ICON */
    #tg-cart-btn {
      position: fixed;
      top: 18px;
      right: 24px;
      z-index: 9000;
      background: none;
      border: 1px solid var(--tg-border);
      color: var(--tg-gold);
      font-family: var(--tg-font);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 8px 16px 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: border-color 0.2s, color 0.2s;
      backdrop-filter: blur(4px);
      background: rgba(26,22,16,0.7);
    }
    #tg-cart-btn:hover { border-color: var(--tg-gold); color: var(--tg-gold-light); }
    #tg-cart-btn svg { width: 18px; height: 18px; }
    #tg-cart-badge {
      background: var(--tg-gold);
      color: #1a1610;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      font-weight: 700;
      display: none;
      align-items: center;
      justify-content: center;
      margin-left: 2px;
    }
    #tg-cart-badge.visible { display: flex; }

    /* DRAWER OVERLAY */
    #tg-drawer-overlay {
      position: fixed; inset: 0;
      background: var(--tg-overlay);
      z-index: 9100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    #tg-drawer-overlay.open { opacity: 1; pointer-events: all; }

    /* DRAWER */
    #tg-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: 380px;
      max-width: 100vw;
      background: var(--tg-surface);
      border-left: 1px solid var(--tg-border);
      z-index: 9200;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    #tg-drawer.open { transform: translateX(0); }

    .tg-drawer-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--tg-border);
    }
    .tg-drawer-head h2 {
      font-family: var(--tg-serif);
      font-size: 20px;
      font-weight: 400;
      color: var(--tg-text);
      letter-spacing: 0.05em;
      margin: 0;
    }
    .tg-close-btn {
      background: none; border: none;
      color: var(--tg-muted); cursor: pointer;
      font-size: 22px; line-height: 1;
      padding: 4px;
      transition: color 0.2s;
    }
    .tg-close-btn:hover { color: var(--tg-text); }

    #tg-cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 16px 24px;
    }
    #tg-cart-items::-webkit-scrollbar { width: 4px; }
    #tg-cart-items::-webkit-scrollbar-track { background: transparent; }
    #tg-cart-items::-webkit-scrollbar-thumb { background: var(--tg-border); }

    .tg-empty {
      text-align: center;
      padding: 48px 0;
      color: var(--tg-muted);
      font-family: var(--tg-font);
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .tg-cart-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--tg-border);
    }
    .tg-item-info { flex: 1; }
    .tg-item-name {
      font-family: var(--tg-serif);
      font-size: 15px;
      color: var(--tg-text);
      margin-bottom: 4px;
    }
    .tg-item-price {
      font-family: var(--tg-font);
      font-size: 12px;
      color: var(--tg-gold);
      letter-spacing: 0.05em;
    }
    .tg-qty-ctrl {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tg-qty-btn {
      background: none;
      border: 1px solid var(--tg-border);
      color: var(--tg-text);
      width: 26px; height: 26px;
      font-size: 14px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s;
    }
    .tg-qty-btn:hover { border-color: var(--tg-gold); color: var(--tg-gold); }
    .tg-qty-num {
      font-family: var(--tg-font);
      font-size: 13px;
      color: var(--tg-text);
      min-width: 16px;
      text-align: center;
    }
    .tg-remove-btn {
      background: none; border: none;
      color: var(--tg-muted); cursor: pointer;
      font-size: 18px; padding: 4px;
      transition: color 0.2s;
    }
    .tg-remove-btn:hover { color: #e24b4a; }

    .tg-drawer-foot {
      padding: 16px 24px 24px;
      border-top: 1px solid var(--tg-border);
    }
    .tg-total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 16px;
    }
    .tg-total-label {
      font-family: var(--tg-font);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--tg-muted);
    }
    .tg-total-amount {
      font-family: var(--tg-serif);
      font-size: 22px;
      color: var(--tg-gold);
    }
    .tg-checkout-btn {
      width: 100%;
      background: var(--tg-gold);
      border: none;
      color: #1a1610;
      font-family: var(--tg-font);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .tg-checkout-btn:hover { background: var(--tg-gold-light); }
    .tg-checkout-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* CHECKOUT OVERLAY */
    #tg-checkout {
      position: fixed; inset: 0;
      background: var(--tg-bg);
      z-index: 9300;
      display: none;
      overflow-y: auto;
    }
    #tg-checkout.open { display: block; }

    .tg-co-wrap {
      max-width: 960px;
      margin: 0 auto;
      padding: 40px 24px 80px;
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 40px;
    }
    @media (max-width: 720px) {
      .tg-co-wrap { grid-template-columns: 1fr; }
    }

    .tg-co-header {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--tg-border);
      margin-bottom: 8px;
    }
    .tg-co-header h1 {
      font-family: var(--tg-serif);
      font-size: 28px;
      font-weight: 400;
      font-style: italic;
      color: var(--tg-text);
      margin: 0;
    }

    .tg-section-title {
      font-family: var(--tg-font);
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--tg-muted);
      margin: 0 0 16px;
    }

    .tg-field-group { margin-bottom: 16px; }
    .tg-field-group label {
      display: block;
      font-family: var(--tg-font);
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--tg-muted);
      margin-bottom: 6px;
    }
    .tg-field-group input, .tg-field-group select {
      width: 100%;
      background: var(--tg-surface);
      border: 1px solid var(--tg-border);
      color: var(--tg-text);
      font-family: var(--tg-font);
      font-size: 13px;
      padding: 10px 12px;
      outline: none;
      transition: border-color 0.2s;
      -webkit-appearance: none;
    }
    .tg-field-group input:focus, .tg-field-group select:focus {
      border-color: var(--tg-gold);
    }
    .tg-field-group input.error { border-color: #e24b4a; }
    .tg-field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* PAYMENT TABS */
    .tg-pay-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--tg-border);
    }
    .tg-pay-tab {
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--tg-muted);
      font-family: var(--tg-font);
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 10px 18px;
      cursor: pointer;
      margin-bottom: -1px;
      transition: color 0.2s, border-color 0.2s;
    }
    .tg-pay-tab:hover { color: var(--tg-text); }
    .tg-pay-tab.active { color: var(--tg-gold); border-bottom-color: var(--tg-gold); }

    .tg-pay-panel { display: none; }
    .tg-pay-panel.active { display: block; }

    .tg-pay-info {
      background: var(--tg-surface);
      border: 1px solid var(--tg-border);
      padding: 16px;
      margin-bottom: 4px;
    }
    .tg-pay-info p {
      font-family: var(--tg-font);
      font-size: 12px;
      line-height: 1.8;
      color: var(--tg-text);
      margin: 0 0 8px;
    }
    .tg-pay-info p:last-child { margin: 0; }
    .tg-pay-email {
      color: var(--tg-gold);
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    /* ORDER SUMMARY */
    .tg-summary {
      background: var(--tg-surface);
      border: 1px solid var(--tg-border);
      padding: 20px;
      position: sticky;
      top: 24px;
      align-self: start;
    }
    .tg-summary-items { margin: 12px 0 16px; }
    .tg-summary-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-family: var(--tg-font);
      font-size: 12px;
      color: var(--tg-text);
      border-bottom: 1px solid var(--tg-border);
    }
    .tg-summary-item:last-child { border-bottom: none; }
    .tg-summary-item span:last-child { color: var(--tg-gold); }
    .tg-summary-total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-top: 12px;
      border-top: 1px solid var(--tg-border);
    }
    .tg-summary-total-label {
      font-family: var(--tg-font);
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--tg-muted);
    }
    .tg-summary-total-amt {
      font-family: var(--tg-serif);
      font-size: 22px;
      color: var(--tg-gold);
    }

    .tg-place-btn {
      width: 100%;
      background: var(--tg-gold);
      border: none;
      color: #1a1610;
      font-family: var(--tg-font);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 14px;
      cursor: pointer;
      margin-top: 20px;
      transition: background 0.2s;
    }
    .tg-place-btn:hover { background: var(--tg-gold-light); }

    /* THANK YOU */
    #tg-thankyou {
      position: fixed; inset: 0;
      background: var(--tg-bg);
      z-index: 9400;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      padding: 40px;
    }
    #tg-thankyou.open { display: flex; }
    .tg-ty-icon {
      width: 64px; height: 64px;
      border: 1.5px solid var(--tg-gold);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
    }
    .tg-ty-icon svg { width: 28px; height: 28px; stroke: var(--tg-gold); }
    #tg-thankyou h2 {
      font-family: var(--tg-serif);
      font-size: 32px;
      font-weight: 400;
      font-style: italic;
      color: var(--tg-text);
      margin: 0 0 12px;
    }
    #tg-thankyou p {
      font-family: var(--tg-font);
      font-size: 12px;
      letter-spacing: 0.08em;
      color: var(--tg-muted);
      max-width: 440px;
      line-height: 1.9;
      margin: 0 0 8px;
    }
    #tg-ty-order {
      font-family: var(--tg-font);
      font-size: 13px;
      letter-spacing: 0.12em;
      color: var(--tg-gold);
      margin: 8px 0 32px;
    }
    .tg-ty-back {
      background: none;
      border: 1px solid var(--tg-gold);
      color: var(--tg-gold);
      font-family: var(--tg-font);
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 12px 32px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .tg-ty-back:hover { background: var(--tg-gold); color: #1a1610; }

    #tg-ty-pay-instructions {
      font-family: var(--tg-font);
      font-size: 12px;
      line-height: 1.9;
      color: var(--tg-text);
      background: var(--tg-surface);
      border: 1px solid var(--tg-border);
      padding: 16px 24px;
      max-width: 480px;
      margin: 0 0 24px;
      text-align: left;
    }
  `;

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- CART BUTTON ---------- */
  function buildCartBtn() {
    const btn = document.createElement('button');
    btn.id = 'tg-cart-btn';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      Cart
      <span id="tg-cart-badge"></span>
    `;
    btn.addEventListener('click', openDrawer);
    document.body.appendChild(btn);
  }

  function updateBadge() {
    const badge = document.getElementById('tg-cart-badge');
    if (!badge) return;
    const total = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.classList.toggle('visible', total > 0);
  }

  /* ---------- DRAWER ---------- */
  function buildDrawer() {
    const overlay = document.createElement('div');
    overlay.id = 'tg-drawer-overlay';
    overlay.addEventListener('click', closeDrawer);

    const drawer = document.createElement('div');
    drawer.id = 'tg-drawer';
    drawer.innerHTML = `
      <div class="tg-drawer-head">
        <h2>Your Cart</h2>
        <button class="tg-close-btn" id="tg-drawer-close">&times;</button>
      </div>
      <div id="tg-cart-items"></div>
      <div class="tg-drawer-foot">
        <div class="tg-total-row">
          <span class="tg-total-label">Total</span>
          <span class="tg-total-amount" id="tg-drawer-total">C$0</span>
        </div>
        <button class="tg-checkout-btn" id="tg-to-checkout">Proceed to Checkout</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    document.getElementById('tg-drawer-close').addEventListener('click', closeDrawer);
    document.getElementById('tg-to-checkout').addEventListener('click', () => {
      closeDrawer();
      openCheckout();
    });
  }

  function openDrawer() {
    renderCartItems();
    document.getElementById('tg-drawer-overlay').classList.add('open');
    document.getElementById('tg-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    document.getElementById('tg-drawer-overlay').classList.remove('open');
    document.getElementById('tg-drawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCartItems() {
    const container = document.getElementById('tg-cart-items');
    const totalEl = document.getElementById('tg-drawer-total');
    const checkoutBtn = document.getElementById('tg-to-checkout');

    if (cart.length === 0) {
      container.innerHTML = '<div class="tg-empty">Your cart is empty</div>';
      totalEl.textContent = 'C$0';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
      total += item.price * item.qty;
      return `
        <div class="tg-cart-item">
          <div class="tg-item-info">
            <div class="tg-item-name">${item.name}</div>
            <div class="tg-item-price">C$${item.price} each</div>
          </div>
          <div class="tg-qty-ctrl">
            <button class="tg-qty-btn" onclick="window.__tgQty(${idx}, -1)">-</button>
            <span class="tg-qty-num">${item.qty}</span>
            <button class="tg-qty-btn" onclick="window.__tgQty(${idx}, 1)">+</button>
          </div>
          <button class="tg-remove-btn" onclick="window.__tgRemove(${idx})">&times;</button>
        </div>
      `;
    }).join('');
    totalEl.textContent = `C$${total}`;
  }

  window.__tgQty = function(idx, delta) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    renderCartItems();
    updateBadge();
  };

  window.__tgRemove = function(idx) {
    cart.splice(idx, 1);
    renderCartItems();
    updateBadge();
  };

  /* ---------- CHECKOUT ---------- */
  function buildCheckout() {
    const el = document.createElement('div');
    el.id = 'tg-checkout';
    el.innerHTML = `
      <div class="tg-co-wrap">
        <div class="tg-co-header">
          <h1>Checkout</h1>
          <button class="tg-close-btn" id="tg-co-back" style="font-size:14px;letter-spacing:0.12em;font-family:var(--tg-font);color:var(--tg-muted);">&larr; Back to Cart</button>
        </div>

        <div>
          <p class="tg-section-title">Shipping Information</p>
          <div class="tg-field-group">
            <label>Full Name</label>
            <input type="text" id="tg-name" placeholder="Derek Rodgers" />
          </div>
          <div class="tg-field-group">
            <label>Email Address</label>
            <input type="email" id="tg-email" placeholder="you@email.com" />
          </div>
          <div class="tg-field-group">
            <label>Street Address</label>
            <input type="text" id="tg-address" placeholder="123 Main Street" />
          </div>
          <div class="tg-field-row">
            <div class="tg-field-group">
              <label>City</label>
              <input type="text" id="tg-city" placeholder="Brooks" />
            </div>
            <div class="tg-field-group">
              <label>Province / State</label>
              <input type="text" id="tg-province" placeholder="AB" />
            </div>
          </div>
          <div class="tg-field-row">
            <div class="tg-field-group">
              <label>Postal Code</label>
              <input type="text" id="tg-postal" placeholder="T1R 0A1" />
            </div>
            <div class="tg-field-group">
              <label>Country</label>
              <input type="text" id="tg-country" placeholder="Canada" />
            </div>
          </div>

          <p class="tg-section-title" style="margin-top:28px;">Payment Method</p>
          <div class="tg-pay-tabs">
            <button class="tg-pay-tab active" data-tab="etransfer">E-Transfer</button>
            <button class="tg-pay-tab" data-tab="paypal">PayPal</button>
            <button class="tg-pay-tab" data-tab="card">Credit / Debit</button>
          </div>

          <div class="tg-pay-panel active" id="tg-panel-etransfer">
            <div class="tg-pay-info">
              <p>Send your e-transfer to:</p>
              <p class="tg-pay-email">${ETRANSFER_EMAIL}</p>
              <p>Auto-deposit is enabled. Please include your full name and order number in the message field. Your order will ship once payment is confirmed.</p>
            </div>
          </div>

          <div class="tg-pay-panel" id="tg-panel-paypal">
            <div class="tg-pay-info">
              <p>Send your PayPal payment to:</p>
              <p class="tg-pay-email">${PAYPAL_EMAIL}</p>
              <p>Please select "Friends &amp; Family" and include your full name and order number in the notes. Your order will ship once payment is confirmed.</p>
            </div>
          </div>

          <div class="tg-pay-panel" id="tg-panel-card">
            <div class="tg-field-group">
              <label>Cardholder Name</label>
              <input type="text" id="tg-card-name" placeholder="Derek Rodgers" />
            </div>
            <div class="tg-field-group">
              <label>Card Number</label>
              <input type="text" id="tg-card-num" placeholder="1234 5678 9012 3456" maxlength="19" />
            </div>
            <div class="tg-field-row">
              <div class="tg-field-group">
                <label>Expiry</label>
                <input type="text" id="tg-card-exp" placeholder="MM/YY" maxlength="5" />
              </div>
              <div class="tg-field-group">
                <label>CVV</label>
                <input type="text" id="tg-card-cvv" placeholder="123" maxlength="4" />
              </div>
            </div>
          </div>

          <button class="tg-place-btn" id="tg-place-order">Place Order</button>
        </div>

        <div>
          <p class="tg-section-title">Order Summary</p>
          <div class="tg-summary">
            <div class="tg-summary-items" id="tg-co-items"></div>
            <div class="tg-summary-total">
              <span class="tg-summary-total-label">Total</span>
              <span class="tg-summary-total-amt" id="tg-co-total">C$0</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('tg-co-back').addEventListener('click', () => {
      closeCheckout();
      openDrawer();
    });

    // Payment tabs
    el.querySelectorAll('.tg-pay-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        el.querySelectorAll('.tg-pay-tab').forEach(t => t.classList.remove('active'));
        el.querySelectorAll('.tg-pay-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tg-panel-' + tab.dataset.tab).classList.add('active');
      });
    });

    // Card formatting
    const cardNum = document.getElementById('tg-card-num');
    cardNum.addEventListener('input', () => {
      let v = cardNum.value.replace(/\D/g, '').substring(0, 16);
      cardNum.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
    const cardExp = document.getElementById('tg-card-exp');
    cardExp.addEventListener('input', () => {
      let v = cardExp.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
      cardExp.value = v;
    });

    document.getElementById('tg-place-order').addEventListener('click', placeOrder);
  }

  function openCheckout() {
    const el = document.getElementById('tg-checkout');
    renderSummary();
    el.classList.add('open');
    el.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    document.getElementById('tg-checkout').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderSummary() {
    const itemsEl = document.getElementById('tg-co-items');
    const totalEl = document.getElementById('tg-co-total');
    let total = 0;
    itemsEl.innerHTML = cart.map(item => {
      const sub = item.price * item.qty;
      total += sub;
      return `<div class="tg-summary-item"><span>${item.name} &times;${item.qty}</span><span>C$${sub}</span></div>`;
    }).join('');
    totalEl.textContent = `C$${total}`;
  }

  /* ---------- PLACE ORDER ---------- */
  function placeOrder() {
    const fields = ['tg-name', 'tg-email', 'tg-address', 'tg-city', 'tg-province', 'tg-postal', 'tg-country'];
    let valid = true;

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
      } else {
        el.classList.remove('error');
      }
    });

    // Validate card fields if card tab active
    const activeTab = document.querySelector('.tg-pay-tab.active');
    if (activeTab && activeTab.dataset.tab === 'card') {
      ['tg-card-name', 'tg-card-num', 'tg-card-exp', 'tg-card-cvv'].forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
          el.classList.add('error');
          valid = false;
        } else {
          el.classList.remove('error');
        }
      });
    }

    if (!valid) return;

    const orderNum = 'TG-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4);
    const payMethod = activeTab ? activeTab.dataset.tab : 'etransfer';
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    closeCheckout();
    showThankYou(orderNum, payMethod, total);
    cart = [];
    updateBadge();
  }

  /* ---------- THANK YOU ---------- */
  function buildThankYou() {
    const el = document.createElement('div');
    el.id = 'tg-thankyou';
    el.innerHTML = `
      <div class="tg-ty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2>Order Received</h2>
      <p id="tg-ty-order"></p>
      <div id="tg-ty-pay-instructions"></div>
      <button class="tg-ty-back" id="tg-ty-back-btn">Continue Shopping</button>
    `;
    document.body.appendChild(el);
    document.getElementById('tg-ty-back-btn').addEventListener('click', () => {
      document.getElementById('tg-thankyou').classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  function showThankYou(orderNum, payMethod, total) {
    const el = document.getElementById('tg-thankyou');
    document.getElementById('tg-ty-order').textContent = 'Order ' + orderNum + ' — C$' + total;

    const instrEl = document.getElementById('tg-ty-pay-instructions');
    if (payMethod === 'etransfer') {
      instrEl.innerHTML = `<strong style="color:var(--tg-gold);font-family:var(--tg-font);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">Next Step — E-Transfer</strong><br><br>Send C$${total} to <strong style="color:var(--tg-gold)">${ETRANSFER_EMAIL}</strong> and include <strong>${orderNum}</strong> in the message. Auto-deposit is enabled.`;
    } else if (payMethod === 'paypal') {
      instrEl.innerHTML = `<strong style="color:var(--tg-gold);font-family:var(--tg-font);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">Next Step — PayPal</strong><br><br>Send C$${total} to <strong style="color:var(--tg-gold)">${PAYPAL_EMAIL}</strong> via Friends &amp; Family. Include <strong>${orderNum}</strong> in the notes.`;
    } else {
      instrEl.innerHTML = `<strong style="color:var(--tg-gold);font-family:var(--tg-font);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">Payment Received</strong><br><br>Thank you! We'll process your card payment for C$${total} and send a confirmation to your email shortly.`;
    }

    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* ---------- WIRE UP SHOP NOW BUTTONS ---------- */
  function wireButtons() {
    document.querySelectorAll('[data-product]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-product');
        const price = parseFloat(btn.getAttribute('data-price')) || 0;
        const existing = cart.find(i => i.name === name);
        if (existing) {
          existing.qty++;
        } else {
          cart.push({ name, price, qty: 1 });
        }
        updateBadge();
        openDrawer();
      });
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    injectStyles();
    buildCartBtn();
    buildDrawer();
    buildCheckout();
    buildThankYou();
    wireButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
