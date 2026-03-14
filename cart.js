
(function () {
  const STYLE = `
    /* CART ICON */
    .cart-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gold-pale);
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      opacity: 0.65;
      transition: opacity 0.2s, color 0.2s;
      padding: 0;
      position: relative;
    }
    .cart-icon-btn:hover { opacity: 1; color: var(--gold); }
    .cart-icon-btn svg { width: 20px; height: 20px; stroke: currentColor; }
    .cart-badge {
      position: absolute;
      top: -7px;
      right: -8px;
      background: var(--gold);
      color: var(--ink);
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      transition: transform 0.2s;
    }
    .cart-badge.hidden { display: none; }
    .cart-badge.pop { transform: scale(1.4); }

    /* CART DRAWER OVERLAY */
    .cart-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 900;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
      backdrop-filter: blur(2px);
    }
    .cart-overlay.open { opacity: 1; pointer-events: all; }

    /* CART DRAWER */
    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 420px;
      max-width: 100vw;
      background: #0e0b08;
      border-left: 1px solid rgba(201,162,74,0.18);
      z-index: 950;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      box-shadow: -20px 0 60px rgba(0,0,0,0.6);
    }
    .cart-drawer.open { transform: translateX(0); }

    .cart-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.6rem 1.8rem;
      border-bottom: 1px solid rgba(201,162,74,0.12);
      flex-shrink: 0;
    }
    .cart-drawer-title {
      font-family: 'Shippori Mincho', serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--white, #f8f4ee);
      letter-spacing: 0.05em;
    }
    .cart-drawer-title span {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      color: var(--gold, #c9a24a);
      opacity: 0.6;
      margin-left: 0.6rem;
      text-transform: uppercase;
      vertical-align: middle;
    }
    .cart-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.5;
      transition: opacity 0.2s;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cart-close-btn:hover { opacity: 1; }
    .cart-close-btn svg { width: 20px; height: 20px; stroke: currentColor; }

    .cart-items-list {
      flex: 1;
      overflow-y: auto;
      padding: 1.2rem 1.8rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(201,162,74,0.2) transparent;
    }
    .cart-items-list::-webkit-scrollbar { width: 4px; }
    .cart-items-list::-webkit-scrollbar-track { background: transparent; }
    .cart-items-list::-webkit-scrollbar-thumb { background: rgba(201,162,74,0.2); border-radius: 2px; }

    .cart-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem 1.8rem;
    }
    .cart-empty svg { width: 48px; height: 48px; stroke: var(--gold, #c9a24a); opacity: 0.2; }
    .cart-empty-text {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.35;
      text-align: center;
    }

    .cart-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(201,162,74,0.08);
      animation: cart-item-in 0.3s ease both;
    }
    @keyframes cart-item-in { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }

    .cart-item-img {
      width: 60px;
      height: 80px;
      object-fit: cover;
      object-position: top center;
      border: 1px solid rgba(201,162,74,0.15);
      flex-shrink: 0;
      filter: contrast(1.05) brightness(1.05);
    }
    .cart-item-img-placeholder {
      width: 60px;
      height: 80px;
      background: rgba(201,162,74,0.06);
      border: 1px solid rgba(201,162,74,0.15);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .cart-item-info { flex: 1; min-width: 0; }
    .cart-item-name {
      font-family: 'Shippori Mincho', serif;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--gold-light, #e8c878);
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cart-item-price {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.75rem;
      color: var(--gold, #c9a24a);
      margin-bottom: 0.6rem;
    }
    .cart-item-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .qty-btn {
      width: 26px;
      height: 26px;
      background: rgba(201,162,74,0.08);
      border: 1px solid rgba(201,162,74,0.2);
      color: var(--gold, #c9a24a);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      line-height: 1;
      transition: background 0.2s, border-color 0.2s;
      font-family: 'Josefin Sans', sans-serif;
    }
    .qty-btn:hover { background: rgba(201,162,74,0.16); border-color: rgba(201,162,74,0.4); }
    .qty-display {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.78rem;
      color: var(--cream, #faf3e0);
      min-width: 24px;
      text-align: center;
    }
    .remove-item-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.3;
      transition: opacity 0.2s, color 0.2s;
      padding: 2px;
      margin-left: auto;
      display: flex;
      align-items: center;
    }
    .remove-item-btn:hover { opacity: 0.8; color: #c0392b; }
    .remove-item-btn svg { width: 16px; height: 16px; stroke: currentColor; }

    .cart-footer {
      padding: 1.4rem 1.8rem;
      border-top: 1px solid rgba(201,162,74,0.12);
      flex-shrink: 0;
      background: rgba(14,11,8,0.95);
    }
    .cart-subtotal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
    }
    .cart-subtotal-label {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.62rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.5;
    }
    .cart-subtotal-amount {
      font-family: 'Shippori Mincho', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--gold, #c9a24a);
    }
    .cart-checkout-btn {
      width: 100%;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink, #0e0b08);
      background: linear-gradient(135deg, #e8c878, #c9a24a);
      border: none;
      padding: 1.1rem 2rem;
      cursor: pointer;
      border-radius: 1px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(201,162,74,0.25);
    }
    .cart-checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,162,74,0.4); }
    .cart-checkout-btn:disabled { opacity: 0.4; cursor: default; transform: none; box-shadow: none; }

    /* CHECKOUT PAGE */
    .checkout-page {
      position: fixed;
      inset: 0;
      background: #0e0b08;
      z-index: 1000;
      overflow-y: auto;
      display: none;
    }
    .checkout-page.open { display: block; }

    .checkout-topbar {
      position: sticky;
      top: 0;
      background: rgba(14,11,8,0.96);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(201,162,74,0.12);
      padding: 1rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
    }
    .checkout-topbar-brand {
      font-family: 'Shippori Mincho', serif;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--gold, #c9a24a);
      letter-spacing: 0.12em;
    }
    .checkout-back-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.5;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .checkout-back-btn:hover { opacity: 1; }
    .checkout-back-btn svg { width: 16px; height: 16px; stroke: currentColor; }

    .checkout-body {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 2.5rem 5rem;
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 3rem;
      align-items: start;
    }

    .checkout-section-title {
      font-family: 'Shippori Mincho', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--white, #f8f4ee);
      margin-bottom: 1.6rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid rgba(201,162,74,0.12);
    }
    .checkout-section-title em {
      color: var(--gold, #c9a24a);
      font-style: italic;
      font-family: 'Cormorant Garamond', serif;
      font-weight: 400;
    }

    .checkout-field-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .checkout-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .checkout-field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .checkout-field label {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.58rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold, #c9a24a);
      opacity: 0.65;
    }
    .checkout-field input, .checkout-field textarea {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(201,162,74,0.15);
      padding: 0.85rem 1rem;
      color: var(--cream, #faf3e0);
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      outline: none;
      border-radius: 1px;
      transition: border-color 0.2s, background 0.2s;
      width: 100%;
    }
    .checkout-field input:focus, .checkout-field textarea:focus {
      border-color: rgba(201,162,74,0.45);
      background: rgba(201,162,74,0.04);
    }
    .checkout-field input.error {
      border-color: rgba(192,57,43,0.6);
    }
    .checkout-field .field-error {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.56rem;
      letter-spacing: 0.15em;
      color: #c0392b;
      opacity: 0.9;
    }

    /* PAYMENT TABS */
    .payment-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(201,162,74,0.15);
    }
    .payment-tab {
      flex: 1;
      padding: 0.9rem 0.5rem;
      background: none;
      border: none;
      border-right: 1px solid rgba(201,162,74,0.15);
      cursor: pointer;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.58rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.45;
      transition: opacity 0.2s, background 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
    }
    .payment-tab:last-child { border-right: none; }
    .payment-tab:hover { opacity: 0.8; background: rgba(201,162,74,0.04); }
    .payment-tab.active {
      opacity: 1;
      background: rgba(201,162,74,0.08);
      color: var(--gold, #c9a24a);
    }
    .payment-tab svg { width: 20px; height: 20px; stroke: currentColor; }

    .payment-panel { display: none; }
    .payment-panel.active { display: block; }
    .payment-info-box {
      background: rgba(201,162,74,0.05);
      border: 1px solid rgba(201,162,74,0.15);
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    .payment-info-box p {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      line-height: 1.8;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.8;
    }
    .payment-info-box strong {
      color: var(--gold, #c9a24a);
      font-weight: 600;
    }
    .payment-order-note {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.45;
      margin-top: 0.75rem;
    }

    /* STRIPE-STYLE CARD FORM */
    .card-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .card-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .card-field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .card-field label {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.58rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold, #c9a24a);
      opacity: 0.65;
    }
    .card-field input {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(201,162,74,0.15);
      padding: 0.85rem 1rem;
      color: var(--cream, #faf3e0);
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.9rem;
      letter-spacing: 0.12em;
      outline: none;
      border-radius: 1px;
      transition: border-color 0.2s, background 0.2s;
      width: 100%;
    }
    .card-field input:focus {
      border-color: rgba(201,162,74,0.45);
      background: rgba(201,162,74,0.04);
    }
    .card-field input.error { border-color: rgba(192,57,43,0.6); }
    .card-field .field-error {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.56rem;
      letter-spacing: 0.15em;
      color: #c0392b;
      opacity: 0.9;
    }
    .card-icons {
      display: flex;
      gap: 0.4rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .card-icon-badge {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.5rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink, #0e0b08);
      background: var(--gold, #c9a24a);
      padding: 2px 5px;
      border-radius: 2px;
      font-weight: 700;
      opacity: 0.75;
    }

    /* ORDER SUMMARY */
    .order-summary {
      background: rgba(201,162,74,0.03);
      border: 1px solid rgba(201,162,74,0.12);
      padding: 1.8rem;
      position: sticky;
      top: 80px;
    }
    .order-summary-title {
      font-family: 'Shippori Mincho', serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--white, #f8f4ee);
      margin-bottom: 1.4rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid rgba(201,162,74,0.1);
    }
    .order-summary-items {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      margin-bottom: 1.4rem;
    }
    .order-summary-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .order-summary-item-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.95rem;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.8;
      flex: 1;
    }
    .order-summary-item-qty {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.58rem;
      letter-spacing: 0.15em;
      color: var(--gold, #c9a24a);
      opacity: 0.6;
      white-space: nowrap;
    }
    .order-summary-item-price {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.75rem;
      color: var(--gold, #c9a24a);
      white-space: nowrap;
    }
    .order-summary-divider {
      height: 1px;
      background: rgba(201,162,74,0.1);
      margin: 1rem 0;
    }
    .order-summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .order-summary-total-label {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.62rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.5;
    }
    .order-summary-total-amount {
      font-family: 'Shippori Mincho', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gold, #c9a24a);
    }
    .order-summary-note {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.3;
      margin-top: 1rem;
      text-align: center;
    }

    .checkout-submit-btn {
      width: 100%;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink, #0e0b08);
      background: linear-gradient(135deg, #e8c878, #c9a24a);
      border: none;
      padding: 1.2rem 2rem;
      cursor: pointer;
      border-radius: 1px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(201,162,74,0.25);
      margin-top: 2rem;
    }
    .checkout-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,162,74,0.4); }

    /* THANK YOU */
    .thankyou-overlay {
      position: fixed;
      inset: 0;
      background: rgba(14,11,8,0.97);
      z-index: 1100;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      padding: 2rem;
      animation: thankyou-in 0.5s ease both;
    }
    .thankyou-overlay.open { display: flex; }
    @keyframes thankyou-in { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
    .thankyou-icon {
      width: 64px;
      height: 64px;
      border: 2px solid rgba(201,162,74,0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
    }
    .thankyou-icon svg { width: 28px; height: 28px; stroke: var(--gold, #c9a24a); }
    .thankyou-eyebrow {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.62rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: var(--gold, #c9a24a);
      opacity: 0.7;
      margin-bottom: 1rem;
    }
    .thankyou-title {
      font-family: 'Shippori Mincho', serif;
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 700;
      color: var(--white, #f8f4ee);
      line-height: 1.15;
      margin-bottom: 1rem;
    }
    .thankyou-title em {
      color: var(--gold, #c9a24a);
      font-style: italic;
      font-family: 'Cormorant Garamond', serif;
      font-weight: 400;
    }
    .thankyou-order-num {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold, #c9a24a);
      opacity: 0.65;
      margin-bottom: 1.5rem;
      background: rgba(201,162,74,0.08);
      border: 1px solid rgba(201,162,74,0.18);
      display: inline-block;
      padding: 0.6rem 1.4rem;
    }
    .thankyou-message {
      font-size: 1rem;
      line-height: 1.85;
      color: var(--gold-pale, #f5e8c0);
      opacity: 0.7;
      max-width: 480px;
      margin-bottom: 2.5rem;
    }
    .thankyou-continue-btn {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--ink, #0e0b08);
      background: linear-gradient(135deg, #e8c878, #c9a24a);
      border: none;
      padding: 1rem 2.5rem;
      cursor: pointer;
      border-radius: 1px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(201,162,74,0.25);
    }
    .thankyou-continue-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,162,74,0.4); }
    .thankyou-rule {
      width: 50px;
      height: 2px;
      background: var(--gold, #c9a24a);
      margin: 0 auto 2rem;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .cart-drawer { width: 100vw; }
      .checkout-body { grid-template-columns: 1fr; }
      .checkout-field-row { grid-template-columns: 1fr; }
      .card-field-row { grid-template-columns: 1fr; }
    }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  let cart = [];

  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function generateOrderNumber() {
    return 'TG-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
  }

  function updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = getTotalItems();
    badge.textContent = count > 9 ? '9+' : count;
    badge.classList.toggle('hidden', count === 0);
  }

  function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    if (!list) return;

    if (cart.length === 0) {
      list.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <div class="cart-empty-text">Your cart is empty</div>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = '';

    list.innerHTML = cart.map((item, i) => `
      <div class="cart-item" data-index="${i}">
        ${item.img
          ? `<img class="cart-item-img" src="${item.img}" alt="${item.name}">`
          : `<div class="cart-item-img-placeholder">🎸</div>`}
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">C$${item.price}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-index="${i}">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-index="${i}">+</button>
            <button class="remove-item-btn" data-action="remove" data-index="${i}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const total = document.getElementById('cart-total');
    if (total) total.textContent = 'C$' + getTotal();
  }

  function openDrawer() {
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  }

  function closeDrawer() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function openCheckout() {
    closeDrawer();
    renderCheckoutSummary();
    document.getElementById('checkout-page').classList.add('open');
    document.getElementById('checkout-page').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    document.getElementById('checkout-page').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCheckoutSummary() {
    const container = document.getElementById('order-summary-items');
    const total = document.getElementById('order-summary-total');
    if (!container) return;
    container.innerHTML = cart.map(item => `
      <div class="order-summary-item">
        <div class="order-summary-item-name">${item.name}</div>
        <div class="order-summary-item-qty">× ${item.qty}</div>
        <div class="order-summary-item-price">C$${item.price * item.qty}</div>
      </div>
    `).join('');
    if (total) total.textContent = 'C$' + getTotal();

    const orderNumEl = document.getElementById('checkout-order-num-display');
    const pendingOrderNum = generateOrderNumber();
    if (orderNumEl) orderNumEl.textContent = pendingOrderNum;
    window._pendingOrderNumber = pendingOrderNum;
  }

  function addToCart(name, price, img) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1, img });
    }
    updateBadge();
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.classList.add('pop');
      setTimeout(() => badge.classList.remove('pop'), 300);
    }
    renderCartItems();
  }

  function buildCartIcon() {
    const btn = document.createElement('li');
    btn.innerHTML = `
      <button class="cart-icon-btn" id="cart-open-btn" aria-label="Open cart">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span class="cart-badge hidden" id="cart-badge">0</span>
      </button>
    `;
    return btn;
  }

  function buildCartDrawer() {
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cart-overlay';

    const drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.id = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <div class="cart-drawer-title">Cart <span>Tsunami Merch</span></div>
        <button class="cart-close-btn" id="cart-close-btn" aria-label="Close cart">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="cart-items-list" id="cart-items-list">
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <div class="cart-empty-text">Your cart is empty</div>
        </div>
      </div>
      <div class="cart-footer" id="cart-footer" style="display:none">
        <div class="cart-subtotal">
          <span class="cart-subtotal-label">Subtotal (CAD)</span>
          <span class="cart-subtotal-amount" id="cart-total">C$0</span>
        </div>
        <button class="cart-checkout-btn" id="cart-checkout-btn">Proceed to Checkout</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  function buildCheckoutPage() {
    const page = document.createElement('div');
    page.className = 'checkout-page';
    page.id = 'checkout-page';
    page.innerHTML = `
      <div class="checkout-topbar">
        <div class="checkout-topbar-brand">Tsunami Guitars</div>
        <button class="checkout-back-btn" id="checkout-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Cart
        </button>
      </div>
      <div class="checkout-body">
        <div class="checkout-left">
          <div class="checkout-section-title">Shipping <em>Details</em></div>
          <div class="checkout-field-group" id="shipping-fields">
            <div class="checkout-field">
              <label>Full Name</label>
              <input type="text" id="field-name" placeholder="Jane Smith" autocomplete="name">
              <span class="field-error" id="err-name"></span>
            </div>
            <div class="checkout-field">
              <label>Email Address</label>
              <input type="email" id="field-email" placeholder="jane@example.com" autocomplete="email">
              <span class="field-error" id="err-email"></span>
            </div>
            <div class="checkout-field">
              <label>Street Address</label>
              <input type="text" id="field-address" placeholder="123 Main Street" autocomplete="address-line1">
              <span class="field-error" id="err-address"></span>
            </div>
            <div class="checkout-field-row">
              <div class="checkout-field">
                <label>City</label>
                <input type="text" id="field-city" placeholder="Vancouver" autocomplete="address-level2">
                <span class="field-error" id="err-city"></span>
              </div>
              <div class="checkout-field">
                <label>Province / State</label>
                <input type="text" id="field-province" placeholder="BC" autocomplete="address-level1">
                <span class="field-error" id="err-province"></span>
              </div>
            </div>
            <div class="checkout-field-row">
              <div class="checkout-field">
                <label>Postal / ZIP Code</label>
                <input type="text" id="field-postal" placeholder="V5K 1A0" autocomplete="postal-code">
                <span class="field-error" id="err-postal"></span>
              </div>
              <div class="checkout-field">
                <label>Country</label>
                <input type="text" id="field-country" placeholder="Canada" autocomplete="country-name" value="Canada">
                <span class="field-error" id="err-country"></span>
              </div>
            </div>
          </div>

          <div class="checkout-section-title">Payment <em>Method</em></div>
          <div class="payment-tabs" id="payment-tabs">
            <button class="payment-tab active" data-tab="paypal">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 11C7 11 6.5 14 9.5 14H14C17 14 18 12 18 10C18 8 16.5 7 14 7H9L7 18H5L7.5 6H14C18 6 20 8 20 10C20 13.5 17.5 16 14 16H10.5L9.5 20H7.5L9 14"/>
              </svg>
              PayPal
            </button>
            <button class="payment-tab" data-tab="card">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Credit / Debit
            </button>
            <button class="payment-tab" data-tab="etransfer">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92"/>
              </svg>
              E-Transfer
            </button>
          </div>

          <div class="payment-panel active" id="panel-paypal">
            <div class="payment-info-box">
              <p>Send payment to <strong>derekrodgers1978@gmail.com</strong> on PayPal and include your order number in the notes.</p>
              <div class="payment-order-note">Your order number will be shown after confirming your order</div>
            </div>
          </div>

          <div class="payment-panel" id="panel-etransfer">
            <div class="payment-info-box">
              <p>Send e-transfer to <strong>derekrodgers1978@gmail.com</strong> and include your order number in the notes. Auto-deposit is enabled.</p>
              <div class="payment-order-note">Your order number will be shown after confirming your order</div>
            </div>
          </div>

          <div class="payment-panel" id="panel-card">
            <div class="card-form">
              <div class="card-icons">
                <span class="card-icon-badge">VISA</span>
                <span class="card-icon-badge">MC</span>
                <span class="card-icon-badge">AMEX</span>
              </div>
              <div class="card-field">
                <label>Card Number</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" autocomplete="cc-number">
                <span class="field-error" id="err-card-number"></span>
              </div>
              <div class="card-field">
                <label>Cardholder Name</label>
                <input type="text" id="card-name" placeholder="Jane Smith" autocomplete="cc-name">
                <span class="field-error" id="err-card-name"></span>
              </div>
              <div class="card-field-row">
                <div class="card-field">
                  <label>Expiry Date</label>
                  <input type="text" id="card-expiry" placeholder="MM / YY" maxlength="7" autocomplete="cc-exp">
                  <span class="field-error" id="err-card-expiry"></span>
                </div>
                <div class="card-field">
                  <label>CVV</label>
                  <input type="text" id="card-cvv" placeholder="123" maxlength="4" autocomplete="cc-csc">
                  <span class="field-error" id="err-card-cvv"></span>
                </div>
              </div>
            </div>
          </div>

          <button class="checkout-submit-btn" id="checkout-submit-btn">Confirm Order</button>
        </div>

        <div class="checkout-right">
          <div class="order-summary">
            <div class="order-summary-title">Order Summary</div>
            <div class="order-summary-items" id="order-summary-items"></div>
            <div class="order-summary-divider"></div>
            <div class="order-summary-total">
              <span class="order-summary-total-label">Total (CAD)</span>
              <span class="order-summary-total-amount" id="order-summary-total">C$0</span>
            </div>
            <div class="order-summary-note">Ships Canada-wide &bull; Secure checkout</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(page);
  }

  function buildThankYou() {
    const overlay = document.createElement('div');
    overlay.className = 'thankyou-overlay';
    overlay.id = 'thankyou-overlay';
    overlay.innerHTML = `
      <div class="thankyou-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="thankyou-eyebrow">Order Confirmed</div>
      <div class="thankyou-title">Thank <em>You!</em></div>
      <div class="thankyou-rule"></div>
      <div class="thankyou-order-num" id="thankyou-order-num">TG-XXXXXX</div>
      <p class="thankyou-message" id="thankyou-message">
        Your order has been received. We'll be in touch shortly with shipping details.
      </p>
      <button class="thankyou-continue-btn" id="thankyou-continue-btn">Continue Shopping</button>
    `;
    document.body.appendChild(overlay);
  }

  function showThankYou(orderNum, paymentMethod) {
    closeCheckout();
    const overlay = document.getElementById('thankyou-overlay');
    const orderNumEl = document.getElementById('thankyou-order-num');
    const messageEl = document.getElementById('thankyou-message');

    if (orderNumEl) orderNumEl.textContent = orderNum;

    let msg = `Your order <strong>${orderNum}</strong> has been received. We'll be in touch shortly with shipping details.`;
    if (paymentMethod === 'paypal') {
      msg = `Please send payment to <strong>derekrodgers1978@gmail.com</strong> on PayPal with order number <strong>${orderNum}</strong> in the notes. We'll dispatch your order once payment is confirmed.`;
    } else if (paymentMethod === 'etransfer') {
      msg = `Please send an e-transfer to <strong>derekrodgers1978@gmail.com</strong> with order number <strong>${orderNum}</strong> in the notes. Auto-deposit is enabled. We'll dispatch once payment clears.`;
    } else if (paymentMethod === 'card') {
      msg = `Your payment is being processed for order <strong>${orderNum}</strong>. You'll receive a confirmation email shortly.`;
    }

    if (messageEl) messageEl.innerHTML = msg;
    if (overlay) overlay.classList.add('open');
  }

  function validateCheckout(paymentMethod) {
    let valid = true;

    function setError(id, errId, msg) {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el) return;
      if (!el.value.trim()) {
        el.classList.add('error');
        if (err) err.textContent = msg;
        valid = false;
      } else {
        el.classList.remove('error');
        if (err) err.textContent = '';
      }
    }

    setError('field-name', 'err-name', 'Full name is required');
    setError('field-email', 'err-email', 'Email is required');
    setError('field-address', 'err-address', 'Address is required');
    setError('field-city', 'err-city', 'City is required');
    setError('field-province', 'err-province', 'Province is required');
    setError('field-postal', 'err-postal', 'Postal code is required');
    setError('field-country', 'err-country', 'Country is required');

    const emailEl = document.getElementById('field-email');
    const emailErr = document.getElementById('err-email');
    if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl.classList.add('error');
      if (emailErr) emailErr.textContent = 'Enter a valid email address';
      valid = false;
    }

    if (paymentMethod === 'card') {
      setError('card-number', 'err-card-number', 'Card number is required');
      setError('card-name', 'err-card-name', 'Cardholder name is required');
      setError('card-expiry', 'err-card-expiry', 'Expiry date is required');
      setError('card-cvv', 'err-card-cvv', 'CVV is required');

      const cardNum = document.getElementById('card-number');
      const cardNumErr = document.getElementById('err-card-number');
      if (cardNum && cardNum.value.replace(/\s/g, '').length < 13) {
        cardNum.classList.add('error');
        if (cardNumErr) cardNumErr.textContent = 'Enter a valid card number';
        valid = false;
      }
    }

    return valid;
  }

  function formatCardNumber(input) {
    input.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = val.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  function formatExpiry(input) {
    input.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + ' / ' + val.substring(2);
      this.value = val;
    });
  }

  function attachEvents() {
    document.getElementById('cart-open-btn').addEventListener('click', openDrawer);
    document.getElementById('cart-close-btn').addEventListener('click', closeDrawer);
    document.getElementById('cart-overlay').addEventListener('click', closeDrawer);
    document.getElementById('cart-checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('checkout-back-btn').addEventListener('click', () => {
      closeCheckout();
      openDrawer();
    });

    document.getElementById('cart-items-list').addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const idx = parseInt(btn.dataset.index);
      const action = btn.dataset.action;
      if (action === 'inc') {
        cart[idx].qty++;
      } else if (action === 'dec') {
        if (cart[idx].qty > 1) cart[idx].qty--;
        else cart.splice(idx, 1);
      } else if (action === 'remove') {
        cart.splice(idx, 1);
      }
      updateBadge();
      renderCartItems();
    });

    document.querySelectorAll('.merch-card-link').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.merch-card');
        const name = card.querySelector('.merch-card-name').textContent.trim();
        const priceText = card.querySelector('.merch-card-price').textContent.trim();
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        const imgEl = card.querySelector('.merch-product-img');
        const img = imgEl ? imgEl.src : null;
        addToCart(name, price, img);
        openDrawer();
      });
    });

    document.getElementById('payment-tabs').addEventListener('click', function (e) {
      const tab = e.target.closest('.payment-tab');
      if (!tab) return;
      document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.payment-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });

    document.getElementById('checkout-submit-btn').addEventListener('click', function () {
      const activeTab = document.querySelector('.payment-tab.active');
      const paymentMethod = activeTab ? activeTab.dataset.tab : 'paypal';
      if (!validateCheckout(paymentMethod)) return;
      const orderNum = window._pendingOrderNumber || generateOrderNumber();
      showThankYou(orderNum, paymentMethod);
      cart = [];
      updateBadge();
    });

    document.getElementById('thankyou-continue-btn').addEventListener('click', function () {
      document.getElementById('thankyou-overlay').classList.remove('open');
      closeCheckout();
      document.body.style.overflow = '';
    });

    const cardNumInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardNumInput) formatCardNumber(cardNumInput);
    if (cardExpiryInput) formatExpiry(cardExpiryInput);
  }

  function init() {
    injectStyles();

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.appendChild(buildCartIcon());
    }

    buildCartDrawer();
    buildCheckoutPage();
    buildThankYou();
    attachEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
