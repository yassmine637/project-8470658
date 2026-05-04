import express from 'express';
import Order from '../models/Order.js';
import ConfiguratorOrder from '../models/ConfiguratorOrder.js';
import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';
import { sendOrderStatusUpdate } from '../services/email.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', async (req, res) => {
  try {
    const [totalOrders, totalUsers, pendingConfigs, unreadMessages, totalProducts] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      ConfiguratorOrder.countDocuments({ status: 'new' }),
      ContactMessage.countDocuments({ read: false }),
      Product.countDocuments({ active: true }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalTTC' } } },
    ]);
    const revenue = revenueResult[0]?.total || 0;

    res.json({ totalOrders, totalUsers, pendingConfigs, unreadMessages, totalProducts, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    const customerName = order.guestName || order.user?.name || 'Client';
    const customerEmail = order.guestEmail || order.user?.email;
    if (customerEmail) {
      sendOrderStatusUpdate({ order, customerName, customerEmail });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/configurator-orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const orders = await ConfiguratorOrder.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await ConfiguratorOrder.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/configurator-orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await ConfiguratorOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Devis introuvable' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await ContactMessage.countDocuments();
    res.json({ messages, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/messages/:id/read', async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
