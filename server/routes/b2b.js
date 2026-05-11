import express from 'express';
import { body, validationResult } from 'express-validator';
import { Resend } from 'resend';

const router = express.Router();
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const TO   = process.env.CONTACT_EMAIL      || 'contact@domainefendri.com';

const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY non configuré');
  return new Resend(key);
};

router.post(
  '/',
  [
    body('company').trim().notEmpty().withMessage('Nom de la société requis'),
    body('contact').trim().notEmpty().withMessage('Nom du contact requis'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { company, contact, email, phone, country, product, volume, incoterm, message } = req.body;

    try {
      const resend = getResend();
      await resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `[B2B] Demande de prix — ${company} (${country})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2617;">
            <div style="background: #1a2617; padding: 32px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: #c9a84c; margin: 0; font-size: 22px;">DOMAINE FENDRI</h1>
              <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">Nouvelle demande B2B / Grossiste</p>
            </div>
            <div style="background: #fff; padding: 32px; border: 1px solid #e8e8e0; border-top: none;">
              <table style="width: 100%; border-collapse: collapse;">
                ${[
                  ['Société', company],
                  ['Contact', contact],
                  ['Email', `<a href="mailto:${email}" style="color:#c9a84c;">${email}</a>`],
                  ['Téléphone', phone || '—'],
                  ['Pays', country || '—'],
                  ['Produit', product || '—'],
                  ['Volume souhaité', volume || '—'],
                  ['INCOTERM', incoterm || '—'],
                ].map(([k, v]) => `
                  <tr style="border-bottom: 1px solid #f0ede6;">
                    <td style="padding: 12px 0; font-size: 12px; color: #9aaa96; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; width: 40%;">${k}</td>
                    <td style="padding: 12px 0; font-size: 13px; color: #1a2617; font-weight: 500;">${v}</td>
                  </tr>
                `).join('')}
              </table>
              ${message ? `
                <div style="margin-top: 24px; padding: 20px; background: #f8f6f1; border-radius: 8px; border-left: 3px solid #c9a84c;">
                  <p style="font-size: 12px; color: #9aaa96; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px;">Message</p>
                  <p style="font-size: 13px; color: #4a5a46; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
                </div>
              ` : ''}
            </div>
            <div style="background: #f8f6f1; padding: 20px 32px; border-radius: 0 0 8px 8px; border: 1px solid #e8e8e0; border-top: none; text-align: center;">
              <p style="font-size: 11px; color: #9aaa96; margin: 0;">Domaine Fendri · Meknessi, Sfax, Tunisie · contact@domainefendri.com</p>
            </div>
          </div>
        `,
      });

      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Domaine Fendri — Votre demande B2B a bien été reçue',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2617;">
            <div style="background: #1a2617; padding: 32px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: #c9a84c; margin: 0; font-size: 22px;">DOMAINE FENDRI</h1>
            </div>
            <div style="background: #fff; padding: 40px 32px; border: 1px solid #e8e8e0; border-top: none;">
              <p style="font-size: 15px; color: #1a2617; line-height: 1.7;">Bonjour ${contact},</p>
              <p style="font-size: 14px; color: #4a5a46; line-height: 1.8;">Nous avons bien reçu votre demande B2B pour <strong>${company}</strong>. Notre équipe export vous répondra dans les <strong>24 à 48 heures ouvrables</strong>.</p>
              <p style="font-size: 14px; color: #4a5a46; line-height: 1.8;">Pour toute urgence, contactez-nous directement à <a href="mailto:contact@domainefendri.com" style="color:#c9a84c;">contact@domainefendri.com</a>.</p>
              <div style="margin: 32px 0 0; padding: 20px; background: #f8f6f1; border-radius: 8px; text-align: center;">
                <p style="font-size: 13px; color: #6b7c68; margin: 0; font-style: italic;">Domaine Fendri · Fondé en 1911 · Sfax, Tunisie</p>
              </div>
            </div>
          </div>
        `,
      });

      res.status(201).json({ message: 'Demande B2B envoyée avec succès' });
    } catch (err) {
      console.error('B2B email error:', err);
      res.status(500).json({ message: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
    }
  }
);

export default router;
