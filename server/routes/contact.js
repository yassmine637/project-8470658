import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, pays, sujet, message } = req.body;
    if (!nom || !prenom || !email || !sujet || !message)
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    if (message.length > 500)
      return res.status(400).json({ message: 'Message trop long (500 caractères max)' });

    await ContactMessage.create({ nom, prenom, email, telephone: telephone || '', pays: pays || '', sujet, message });
    res.status(201).json({ success: true, message: 'Message reçu. Nous vous répondrons sous 24h.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
