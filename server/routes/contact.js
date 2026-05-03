import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import { validateContact } from '../middleware/validate.js';

const router = express.Router();

router.post('/', contactLimiter, validateContact, async (req, res) => {
  try {
    const { nom, prenom, email, telephone, pays, sujet, message } = req.body;
    await ContactMessage.create({
      nom,
      prenom,
      email,
      telephone: telephone ? telephone.slice(0, 30) : '',
      pays: pays ? pays.slice(0, 100) : '',
      sujet,
      message,
    });
    res.status(201).json({ success: true, message: 'Message reçu. Nous vous répondrons sous 24h.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
});

export default router;
