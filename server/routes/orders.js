import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimit.js';
import { validateOrder } from '../middleware/validate.js';
import { sendOrderConfirmation, sendOrderNotificationToAdmin, sendOrderStatusUpdate } from '../services/email.js';

const router = express.Router();

async function checkStock(items) {
  const slugs = items.map((i) => i.productId);
  const products = await Product.find({ slug: { $in: slugs } }).select('slug name stock');
  for (const item of items) {
    const product = products.find((p) => p.slug === item.productId);
    if (!product) return { ok: false, message: `Produit introuvable : ${item.productId}` };
    if (product.stock < item.quantity) {
      return {
        ok: false,
        message: `Stock insuffisant pour "${product.name}" — ${product.stock} disponible(s), ${item.quantity} demandé(s)`,
      };
    }
  }
  return { ok: true };
}

router.post('/', orderLimiter, validateOrder, async (req, res) => {
  try {
    const { items, guestName, guestEmail, guestPhone, shippingAddress, currency, notes, paymentMethod } = req.body;

    if (!guestName || !guestEmail)
      return res.status(400).json({ message: 'Nom et email requis' });

    // Vérification du stock avant création de la commande
    const stockCheck = await checkStock(items);
    if (!stockCheck.ok) return res.status(400).json({ message: stockCheck.message });

    const totalHT = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tva = Math.round(totalHT * 0.19);
    const totalTTC = totalHT + tva;

    const validPaymentMethods = ['cod', 'paypal', 'stripe', 'konnect'];
    const order = await Order.create({
      items,
      guestName,
      guestEmail,
      guestPhone: guestPhone ? guestPhone.slice(0, 30) : '',
      totalHT,
      tva,
      totalTTC,
      currency: ['TND', 'EUR', 'USD'].includes(currency) ? currency : 'TND',
      shippingAddress: shippingAddress || {},
      notes: notes ? notes.slice(0, 500) : '',
      paymentMethod: validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'cod',
    });

    // Décrémenter le stock pour chaque produit commandé
    await Promise.all(
      items.map(({ productId, quantity }) =>
        Product.findOneAndUpdate(
          { slug: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } }
        )
      )
    );

    await Promise.all([
      sendOrderConfirmation({ order, customerName: guestName, customerEmail: guestEmail }),
      sendOrderNotificationToAdmin({ order, customerName: guestName, customerEmail: guestEmail }),
    ]);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande' });
  }
});

router.post('/authenticated', protect, validateOrder, async (req, res) => {
  try {
    const { items, shippingAddress, currency, notes } = req.body;

    // Vérification du stock avant création de la commande
    const stockCheck = await checkStock(items);
    if (!stockCheck.ok) return res.status(400).json({ message: stockCheck.message });

    const totalHT = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tva = Math.round(totalHT * 0.19);
    const totalTTC = totalHT + tva;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalHT,
      tva,
      totalTTC,
      currency: ['TND', 'EUR', 'USD'].includes(currency) ? currency : 'TND',
      shippingAddress: shippingAddress || {},
      notes: notes ? notes.slice(0, 500) : '',
    });

    // Décrémenter le stock pour chaque produit commandé
    await Promise.all(
      items.map(({ productId, quantity }) =>
        Product.findOneAndUpdate(
          { slug: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } }
        )
      )
    );

    const user = await User.findById(req.user._id).select('name email');
    if (user) {
      await Promise.all([
        sendOrderConfirmation({ order, customerName: user.name, customerEmail: user.email }),
        sendOrderNotificationToAdmin({ order, customerName: user.name, customerEmail: user.email }),
      ]);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const id = req.params.id.replace(/[^a-f0-9]/gi, '').slice(0, 24);
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Accès refusé' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const id = req.params.id.replace(/[^a-f0-9]/gi, '').slice(0, 24);
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.user?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Accès refusé' });

    if (!['pending', 'paid'].includes(order.status))
      return res.status(400).json({ message: 'Cette commande ne peut plus être annulée (déjà en préparation ou expédiée).' });

    order.status = 'cancelled';
    await order.save();

    const user = await User.findById(req.user._id).select('name email');
    if (user) {
      await sendOrderStatusUpdate({ order, customerName: user.name, customerEmail: user.email });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande' });
  }
});

export default router;
