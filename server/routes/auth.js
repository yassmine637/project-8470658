import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';
import { authLimiter, passwordChangeLimiter } from '../middleware/rateLimit.js';
import { validateAuth } from '../middleware/validate.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.js';

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

router.put('/change-password', protect, passwordChangeLimiter, async (req, res) => {
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

router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond the same way to avoid user enumeration
    if (!user) {
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation vous a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const domain = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';
    const resetUrl = `${domain}/auth?mode=reset&token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendPasswordResetEmail({ name: user.name, email: user.email, resetUrl });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n🔑 [DEV] Lien de réinitialisation pour ${user.email}:\n${resetUrl}\n`);
    }

    res.json({ message: 'Si cet email existe, un lien de réinitialisation vous a été envoyé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
  }
});

router.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword)
      return res.status(400).json({ message: 'Token, email et nouveau mot de passe requis' });
    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 8 caractères' });
    if (newPassword.length > 128)
      return res.status(400).json({ message: 'Mot de passe trop long' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: 'Lien invalide ou expiré. Veuillez refaire une demande.' });

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
  }
});

export default router;
