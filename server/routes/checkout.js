import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key);
};

router.post('/create-session', async (req, res) => {
  try {
    const stripe = getStripe();
    const { items, guestEmail, currency, orderId } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Panier vide' });

    const currencyCode = (currency || 'TND').toLowerCase();
    const supportedCurrencies = ['usd', 'eur', 'gbp', 'chf', 'cad', 'aud', 'jpy'];
    const stripeCurrency = supportedCurrencies.includes(currencyCode) ? currencyCode : 'eur';

    const conversionRates = { usd: 0.32, eur: 0.30, gbp: 0.25, chf: 0.29, cad: 0.44, aud: 0.49, jpy: 48 };
    const rate = conversionRates[stripeCurrency] || 0.30;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: stripeCurrency,
        product_data: { name: `${item.productName} — ${item.volume || ''}`.trim() },
        unit_amount: Math.round(item.price * rate * 100),
      },
      quantity: item.quantity,
    }));

    const domain = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: guestEmail || undefined,
      success_url: `${domain}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/checkout/cancel`,
      metadata: { orderId: orderId || '' },
    });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { stripeSessionId: session.id });
    }

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = webhookSecret
      ? getStripe().webhooks.constructEvent(req.body, sig, webhookSecret)
      : JSON.parse(req.body);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: 'paid', stripePaymentIntentId: session.payment_intent || '' }
    );
  }

  res.json({ received: true });
});

export default router;
