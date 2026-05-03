import express from 'express';
import ConfiguratorOrder from '../models/ConfiguratorOrder.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name, email, phone, country, currency,
      configuration, quantity, totalHT, totalTTC, message,
    } = req.body;

    if (!name || !email) return res.status(400).json({ message: 'Nom et email requis' });
    if (!configuration?.model || !configuration?.size)
      return res.status(400).json({ message: 'Configuration incomplète' });

    const year = new Date().getFullYear();
    const devisNumber = `FND-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const order = await ConfiguratorOrder.create({
      devisNumber,
      name,
      email,
      phone: phone || '',
      country: country || '',
      currency: currency || 'TND',
      configuration,
      quantity: quantity || 1,
      totalHT,
      totalTTC,
      message: message || '',
    });

    res.status(201).json({ order, devisNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/track/:devisNumber', async (req, res) => {
  try {
    const order = await ConfiguratorOrder.findOne({ devisNumber: req.params.devisNumber });
    if (!order) return res.status(404).json({ message: 'Devis introuvable' });
    res.json({ status: order.status, devisNumber: order.devisNumber, createdAt: order.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
