const Stripe = require('stripe');
const guitarCatalog = require('../../guitars.json').guitars;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Please refresh the page and try again.' }, 400);
  }

  const ids = body?.productIds;
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 10 ||
      ids.some(id => typeof id !== 'string') || new Set(ids).size !== ids.length) {
    return json({ error: 'Your cart is invalid. Refresh the page and try again.' }, 400);
  }
  if (name.length < 1 || name.length > 120 ||
      email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Enter a valid name and email address.' }, 400);
  }

  const byId = new Map(guitarCatalog.map(guitar => [guitar.id, guitar]));
  const guitars = ids.map(id => byId.get(id));
  if (guitars.some(guitar => !guitar || guitar.status !== 'available')) {
    return json({ error: 'One or more guitars in your cart are no longer available. Please refresh the inventory.' }, 409);
  }
  if (guitars.some(guitar => !Number.isSafeInteger(guitar.price_num) || guitar.price_num < 1)) {
    return json({ error: 'A guitar price could not be verified. Please contact us.' }, 409);
  }

  const amount = guitars.reduce((total, guitar) => total + guitar.price_num * 100, 0);
  if (!Number.isSafeInteger(amount) || amount > 99999999) {
    return json({ error: 'This cart total cannot be processed online. Please contact us.' }, 400);
  }

  try {
    const secretKey = Netlify.env.get('STRIPE_SECRET_KEY');
    if (!secretKey) return json({ error: 'Card checkout is temporarily unavailable. Please try again later.' }, 503);

    const stripe = Stripe(secretKey);
    const titles = guitars.map(guitar => guitar.title);
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      receipt_email: email,
      description: `Tsunami Guitars — ${titles.join(', ').slice(0, 400)}`,
      metadata: {
        product_ids: ids.join(',').slice(0, 500),
        buyer_name: name.slice(0, 120),
        buyer_email: email.slice(0, 254),
      },
    });

    return json({ clientSecret: intent.client_secret });
  } catch (error) {
    console.error('Guitar checkout error:', error.type || error.code || 'Stripe error');
    return json({ error: 'Could not start secure checkout. Please try again.' }, 502);
  }
};

export const config = { method: ['POST'] };
