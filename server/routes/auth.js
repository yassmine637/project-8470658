import express from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validateAuth } from '../middleware/validate.js';
import { sendWelcomeEmail } from '../services/email.js';

const router = express.Router();

router.post('/register', authLimiter, validateAuth, async (req, res) => {
  try {
    const { name, email, password, phone, country } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Nom, email et mot de passe requis' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email déjà utilisé' });
    const user = await User.create({ name, email, password, phone, country });

    sendWelcomeEmail({ name: user.name, email: user.email });

    res.status(201).json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du compte' });
  }
});

router.post('/login', authLimiter, validateAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    res.json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
});

router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, country } = req.body;
    if (name && (name.length < 2 || name.length > 100))
      return res.status(400).json({ message: 'Nom invalide' });
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone.slice(0, 30);
    if (country) user.country = country.slice(0, 100);
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

router.put('/change-password', protect, authLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau requis' });
    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
    if (newPassword.length > 128)
      return res.status(400).json({ message: 'Mot de passe trop long' });
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
});

export default router;
