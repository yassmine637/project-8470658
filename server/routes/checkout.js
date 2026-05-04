import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();

// ─── Konnect ───────────────────────────────────────────────────────────────
router.post('/konnect/init', async (req, res) => {
  try {
    const apiKey = process.env.KONNECT_API_KEY;
    const walletId = process.env.KONNECT_WALLET_ID;
    if (!apiKey || !walletId) {
      return res.status(503).json({ message: 'Konnect non configuré — clé API manquante' });
    }

    const { items, guestName, guestEmail, guestPhone, shippingAddress, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Panier vide' });
    if (!guestName || !guestEmail) return res.status(400).json({ message: 'Nom et email requis' });

    const totalHT = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tva = Math.round(totalHT * 0.19);
    const totalTTC = totalHT + tva;
    const amountMillimes = Math.round(totalTTC * 1000);

    const order = await Order.create({
      items,
      guestName,
      guestEmail,
      guestPhone: guestPhone ? guestPhone.slice(0, 30) : '',
      totalHT,
      tva,
      totalTTC,
      currency: 'TND',
      shippingAddress: shippingAddress || {},
      notes: notes ? notes.slice(0, 500) : '',
      paymentMethod: 'konnect',
      status: 'pending',
    });

    const domain = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';

    const nameParts = guestName.trim().split(' ');
    const firstName = nameParts[0] || guestName;
    const lastName = nameParts.slice(1).join(' ') || '-';

    const konnectRes = await fetch('https://api.konnect.network/api/v2/payments/init-payment', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiverWalletId: walletId,
        token: 'TND',
        amount: amountMillimes,
        type: 'immediate',
        description: `Commande Domaine Fendri — ${items.map(i => `${i.productName} x${i.quantity}`).join(', ')}`,
        acceptedPaymentMethods: ['wallet', 'bank_card', 'e-DINAR'],
        successUrl: `${domain}/checkout/success?payment_ref=PAYMENT_REF&order_id=${order._id}`,
        failUrl: `${domain}/checkout/cancel?order_id=${order._id}`,
        orderId: order._id.toString(),
        firstName,
        lastName,
        email: guestEmail,
        phoneNumber: guestPhone || '',
        theme: 'light',
      }),
    });

    if (!konnectRes.ok) {
      const errBody = await konnectRes.json().catch(() => ({}));
      return res.status(502).json({ message: errBody.message || 'Erreur Konnect', details: errBody });
    }

    const { payUrl, paymentRef } = await konnectRes.json();
    res.json({ payUrl, paymentRef, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Konnect payment status check ─────────────────────────────────────────
router.get('/konnect/status/:paymentRef', async (req, res) => {
  try {
    const apiKey = process.env.KONNECT_API_KEY;
    if (!apiKey) return res.status(503).json({ message: 'Konnect non configuré' });

    const { paymentRef } = req.params;
    const konnectRes = await fetch(`https://api.konnect.network/api/v2/payments/${paymentRef}`, {
      headers: { 'x-api-key': apiKey },
    });

    if (!konnectRes.ok) return res.status(502).json({ message: 'Erreur Konnect' });

    const data = await konnectRes.json();
    const payment = data.payment;

    if (payment?.status === 'completed') {
      await Order.findByIdAndUpdate(payment.orderId, {
        status: 'paid',
        stripePaymentIntentId: paymentRef,
      });
    }

    res.json({ status: payment?.status, orderId: payment?.orderId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PayPal ────────────────────────────────────────────────────────────────
const getPayPalToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('PayPal non configuré');
  const base = process.env.PAYPAL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return { token: data.access_token, base };
};

router.post('/paypal/init', async (req, res) => {
  try {
    const { token, base } = await getPayPalToken();
    const { items, guestName, guestEmail, guestPhone, shippingAddress, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Panier vide' });
    if (!guestName || !guestEmail) return res.status(400).json({ message: 'Nom et email requis' });

    const totalHT = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tva = Math.round(totalHT * 0.19);
    const totalTTC = totalHT + tva;
    const amountEUR = (totalTTC * 0.30).toFixed(2);

    const order = await Order.create({
      items,
      guestName,
      guestEmail,
      guestPhone: guestPhone ? guestPhone.slice(0, 30) : '',
      totalHT,
      tva,
      totalTTC,
      currency: 'TND',
      shippingAddress: shippingAddress || {},
      notes: notes ? notes.slice(0, 500) : '',
      paymentMethod: 'paypal',
      status: 'pending',
    });

    const domain = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';

    const ppRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: order._id.toString(),
          description: `Domaine Fendri — ${items.map(i => `${i.productName} x${i.quantity}`).join(', ')}`,
          amount: { currency_code: 'EUR', value: amountEUR },
        }],
        application_context: {
          brand_name: 'Domaine Fendri',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${domain}/checkout/success?provider=paypal&order_id=${order._id}`,
          cancel_url: `${domain}/checkout/cancel?order_id=${order._id}`,
        },
      }),
    });

    const ppData = await ppRes.json();
    if (!ppRes.ok) return res.status(502).json({ message: ppData.message || 'Erreur PayPal', details: ppData });

    const approvalLink = ppData.links?.find(l => l.rel === 'approve')?.href;
    res.json({ approvalUrl: approvalLink, paypalOrderId: ppData.id, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/paypal/capture/:paypalOrderId', async (req, res) => {
  try {
    const { token, base } = await getPayPalToken();
    const { paypalOrderId } = req.params;
    const { orderId } = req.body;

    const captureRes = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    const captureData = await captureRes.json();
    if (captureData.status === 'COMPLETED' && orderId) {
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid',
        stripePaymentIntentId: paypalOrderId,
      });
    }
    res.json({ status: captureData.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Stripe ────────────────────────────────────────────────────────────────
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
