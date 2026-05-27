import express from 'express';
import ConfiguratorOrder from '../models/ConfiguratorOrder.js';
import { configuratorLimiter } from '../middleware/rateLimit.js';
import { validateConfigurator } from '../middleware/validate.js';
import { sendDevisConfirmation, sendDevisNotificationToAdmin } from '../services/email.js';

const router = express.Router();

router.post('/', configuratorLimiter, validateConfigurator, async (req, res) => {
  try {
    const {
      name, email, phone, country, currency,
      configuration, quantity, totalHT, totalTTC, message,
    } = req.body;

    if (!configuration?.model || !configuration?.size)
      return res.status(400).json({ message: 'Configuration incomplète' });

    const year = new Date().getFullYear();
    const devisNumber = `FND-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const safeCurrency = ['TND', 'EUR', 'USD', 'GBP'].includes(currency) ? currency : 'TND';

    const order = await ConfiguratorOrder.create({
      devisNumber,
      name,
      email,
      phone: phone ? phone.slice(0, 30) : '',
      country: country ? country.slice(0, 100) : '',
      currency: safeCurrency,
      configuration,
      quantity: quantity || 1,
      totalHT,
      totalTTC,
      message: message ? message.slice(0, 1000) : '',
    });

    // Send emails (non-blocking)
    const emailPayload = {
      devisNumber,
      name,
      email,
      phone,
      country,
      configuration,
      quantity: quantity || 1,
      totalTTC,
      currency: safeCurrency,
      message: message || '',
      shippingAddress: req.body.shippingAddress || {},
    };
    Promise.all([
      sendDevisConfirmation(emailPayload),
      sendDevisNotificationToAdmin(emailPayload),
    ]).catch(err => console.error('[Email] Devis email error:', err?.message || err));

    res.status(201).json({ order, devisNumber });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du devis' });
  }
});

router.get('/track/:devisNumber', async (req, res) => {
  try {
    const dn = req.params.devisNumber.replace(/[^A-Z0-9-]/g, '').slice(0, 20);
    const order = await ConfiguratorOrder.findOne({ devisNumber: dn });
    if (!order) return res.status(404).json({ message: 'Devis introuvable' });
    res.json({ status: order.status, devisNumber: order.devisNumber, createdAt: order.createdAt });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche du devis' });
  }
});

export default router;
