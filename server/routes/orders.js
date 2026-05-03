import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { items, guestName, guestEmail, guestPhone, shippingAddress, currency, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Panier vide' });

    const totalHT = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tva = Math.round(totalHT * 0.19);
    const totalTTC = totalHT + tva;

    const orderData = {
      items,
      totalHT,
      tva,
      totalTTC,
      currency: currency || 'TND',
      shippingAddress: shippingAddress || {},
      notes: notes || '',
    };

    if (req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const { protect: protectFn } = await import('../middleware/auth.js');
        orderData.user = null;
      } catch {}
    }

    if (!orderData.user) {
      if (!guestName || !guestEmail) return res.status(400).json({ message: 'Nom et email requis' });
      orderData.guestName = guestName;
      orderData.guestEmail = guestEmail;
      orderData.guestPhone = guestPhone || '';
    }

    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/authenticated', protect, async (req, res) => {
  try {
    const { items, shippingAddress, currency, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Panier vide' });

    const totalHT = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tva = Math.round(totalHT * 0.19);
    const totalTTC = totalHT + tva;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalHT,
      tva,
      totalTTC,
      currency: currency || 'TND',
      shippingAddress: shippingAddress || {},
      notes: notes || '',
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Accès refusé' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
