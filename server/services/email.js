import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = 'Domaine Fendri';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@fendri.com';

function isEnabled() {
  return Boolean(RESEND_API_KEY);
}

async function send({ to, from, subject, html }) {
  if (!isEnabled()) {
    console.warn('[Email] RESEND_API_KEY non configuré — email non envoyé');
    return;
  }
  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${from.email || FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    if (result.error) {
      console.error('[Email] Resend API error:', JSON.stringify(result.error));
    } else {
      console.log(`[Email] ✅ Envoyé à ${to} — id: ${result.data?.id}`);
    }
  } catch (err) {
    console.error('[Email] Resend exception:', err?.message || err);
  }
}

const COLORS = {
  bg: '#F7F5F0',
  surface: '#FFFFFF',
  primary: '#2C3A23',
  gold: '#A8884A',
  text: '#1A1A1A',
  muted: '#6B6B6B',
  border: '#E2DDD5',
};

function baseLayout(title, content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td align="center" style="padding:0 0 32px 0;">
            <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${COLORS.gold};font-family:Arial,sans-serif;">
              Maison Fendri · Sfax, Tunisie · Fondée en 1911
            </p>
            <h1 style="margin:8px 0 0 0;font-size:28px;letter-spacing:2px;color:${COLORS.primary};font-family:Georgia,serif;font-weight:normal;">
              DOMAINE FENDRI
            </h1>
            <div style="width:48px;height:1px;background:${COLORS.gold};margin:16px auto 0;"></div>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:${COLORS.surface};border:1px solid ${COLORS.border};padding:40px 48px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:32px 0 0 0;">
            <p style="margin:0;font-size:11px;color:${COLORS.muted};font-family:Arial,sans-serif;letter-spacing:1px;">
              © ${new Date().getFullYear()} Domaine Fendri · Tous droits réservés
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:${COLORS.muted};font-family:Arial,sans-serif;">
              Sfax, Tunisie · contact@domainefendri.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatCurrency(amount, currency = 'TND') {
  return `${(amount / 100).toFixed(2)} ${currency}`;
}

function itemsTable(items, currency) {
  const rows = items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};color:${COLORS.text};font-family:Arial,sans-serif;font-size:14px;">
        ${item.productName}${item.volume ? ` <span style="color:${COLORS.muted}">(${item.volume})</span>` : ''}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};text-align:center;color:${COLORS.muted};font-family:Arial,sans-serif;font-size:14px;">
        ×${item.quantity}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};text-align:right;color:${COLORS.text};font-family:Arial,sans-serif;font-size:14px;">
        ${formatCurrency(item.price * item.quantity, currency)}
      </td>
    </tr>
  `).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <th style="text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;padding-bottom:8px;border-bottom:2px solid ${COLORS.primary};">Produit</th>
        <th style="text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;padding-bottom:8px;border-bottom:2px solid ${COLORS.primary};">Qté</th>
        <th style="text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;padding-bottom:8px;border-bottom:2px solid ${COLORS.primary};">Prix</th>
      </tr>
      ${rows}
    </table>
  `;
}

function totalsBlock(order) {
  const currency = order.currency || 'TND';
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.muted};">Sous-total HT</td>
        <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.text};">${formatCurrency(order.totalHT, currency)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.muted};">TVA (19%)</td>
        <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.text};">${formatCurrency(order.tva, currency)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-family:Georgia,serif;font-size:16px;color:${COLORS.primary};font-weight:bold;border-top:2px solid ${COLORS.primary};">Total TTC</td>
        <td style="padding:12px 0 0;text-align:right;font-family:Georgia,serif;font-size:16px;color:${COLORS.gold};font-weight:bold;border-top:2px solid ${COLORS.primary};">${formatCurrency(order.totalTTC, currency)}</td>
      </tr>
    </table>
  `;
}

function shippingBlock(address, paymentMethod) {
  const paymentLabels = {
    cod: 'Paiement à la livraison',
    stripe: 'Carte bancaire (Stripe)',
    paypal: 'PayPal',
    konnect: 'Konnect',
  };
  const parts = [address.street, address.city, address.postalCode, address.country].filter(Boolean);
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;background:${COLORS.bg};padding:20px 24px;">
      <tr>
        <td width="50%" style="vertical-align:top;padding-right:16px;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;">Livraison</p>
          <p style="margin:0;font-size:13px;color:${COLORS.text};font-family:Arial,sans-serif;line-height:1.6;">
            ${parts.length ? parts.join(', ') : 'Adresse non renseignée'}
          </p>
        </td>
        <td width="50%" style="vertical-align:top;padding-left:16px;border-left:1px solid ${COLORS.border};">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;">Paiement</p>
          <p style="margin:0;font-size:13px;color:${COLORS.text};font-family:Arial,sans-serif;">
            ${paymentLabels[paymentMethod] || paymentMethod || 'Non précisé'}
          </p>
        </td>
      </tr>
    </table>
  `;
}

export async function sendOrderConfirmation({ order, customerName, customerEmail }) {
  const orderId = String(order._id).slice(-8).toUpperCase();
  const content = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.gold};font-family:Arial,sans-serif;">
      Confirmation de commande
    </p>
    <h2 style="margin:8px 0 0;font-size:22px;color:${COLORS.primary};font-family:Georgia,serif;font-weight:normal;">
      Merci pour votre commande, ${customerName} !
    </h2>
    <p style="margin:16px 0 0;font-size:14px;color:${COLORS.muted};font-family:Arial,sans-serif;line-height:1.7;">
      Nous avons bien reçu votre commande et nous la préparons avec soin.<br/>
      Vous recevrez une notification dès qu'elle sera expédiée.
    </p>

    <div style="margin:24px 0;padding:14px 20px;background:${COLORS.bg};border-left:3px solid ${COLORS.gold};">
      <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;">Référence commande</p>
      <p style="margin:4px 0 0;font-size:18px;font-family:Georgia,serif;color:${COLORS.primary};letter-spacing:2px;">#DF-${orderId}</p>
    </div>

    ${itemsTable(order.items, order.currency)}
    ${totalsBlock(order)}
    ${shippingBlock(order.shippingAddress || {}, order.paymentMethod)}

    <p style="margin:32px 0 0;font-size:13px;color:${COLORS.muted};font-family:Arial,sans-serif;line-height:1.7;text-align:center;font-style:italic;">
      Pour toute question, répondez à cet email ou contactez-nous à<br/>
      <a href="mailto:contact@domainefendri.com" style="color:${COLORS.gold};text-decoration:none;">contact@domainefendri.com</a>
    </p>
  `;

  await send({
    to: customerEmail,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `Domaine Fendri — Commande #DF-${orderId} confirmée`,
    html: baseLayout('Confirmation de commande', content),
  });
}

export async function sendOrderNotificationToAdmin({ order, customerName, customerEmail }) {
  const orderId = String(order._id).slice(-8).toUpperCase();
  const content = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.gold};font-family:Arial,sans-serif;">
      Nouvelle commande
    </p>
    <h2 style="margin:8px 0 0;font-size:22px;color:${COLORS.primary};font-family:Georgia,serif;font-weight:normal;">
      Commande #DF-${orderId}
    </h2>
    <p style="margin:16px 0 0;font-size:14px;color:${COLORS.muted};font-family:Arial,sans-serif;">
      Client : <strong style="color:${COLORS.text};">${customerName}</strong> — 
      <a href="mailto:${customerEmail}" style="color:${COLORS.gold};text-decoration:none;">${customerEmail}</a>
    </p>
    ${itemsTable(order.items, order.currency)}
    ${totalsBlock(order)}
    ${shippingBlock(order.shippingAddress || {}, order.paymentMethod)}
  `;

  await send({
    to: ADMIN_EMAIL,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `[Admin] Nouvelle commande #DF-${orderId} — ${customerName}`,
    html: baseLayout('Nouvelle commande', content),
  });
}

export async function sendWelcomeEmail({ name, email }) {
  const content = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.gold};font-family:Arial,sans-serif;">
      Bienvenue
    </p>
    <h2 style="margin:8px 0 0;font-size:22px;color:${COLORS.primary};font-family:Georgia,serif;font-weight:normal;">
      Bienvenue, ${name} !
    </h2>
    <p style="margin:20px 0 0;font-size:14px;color:${COLORS.text};font-family:Arial,sans-serif;line-height:1.8;">
      Votre compte Domaine Fendri a été créé avec succès.<br/>
      Découvrez nos huiles d'olive biologiques, pressées à froid depuis 1911 dans la région de Sfax.
    </p>
    <div style="margin:32px 0;text-align:center;">
      <div style="width:48px;height:1px;background:${COLORS.gold};margin:0 auto 24px;"></div>
      <p style="margin:0;font-size:13px;color:${COLORS.muted};font-family:Arial,sans-serif;font-style:italic;line-height:1.8;">
        « L'huile d'olive est l'or liquide de la Méditerranée. »
      </p>
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:${COLORS.muted};font-family:Arial,sans-serif;line-height:1.7;text-align:center;">
      Pour toute question : 
      <a href="mailto:contact@domainefendri.com" style="color:${COLORS.gold};text-decoration:none;">contact@domainefendri.com</a>
    </p>
  `;

  await send({
    to: email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Bienvenue chez Domaine Fendri',
    html: baseLayout('Bienvenue', content),
  });
}

export async function sendPasswordResetEmail({ name, email, resetUrl }) {
  const content = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.gold};font-family:Arial,sans-serif;">
      Sécurité du compte
    </p>
    <h2 style="margin:8px 0 0;font-size:22px;color:${COLORS.primary};font-family:Georgia,serif;font-weight:normal;">
      Réinitialisation de mot de passe
    </h2>
    <p style="margin:20px 0 0;font-size:14px;color:${COLORS.text};font-family:Arial,sans-serif;line-height:1.8;">
      Bonjour ${name},<br/><br/>
      Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte.<br/>
      Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.
    </p>
    <div style="margin:32px 0;text-align:center;">
      <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:${COLORS.primary};color:${COLORS.gold};font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:2px;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    <p style="margin:24px 0 0;font-size:12px;color:${COLORS.muted};font-family:Arial,sans-serif;line-height:1.7;text-align:center;">
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email — votre mot de passe reste inchangé.<br/>
      Ce lien expirera automatiquement dans 1 heure.
    </p>
  `;

  await send({
    to: email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Domaine Fendri — Réinitialisation de votre mot de passe',
    html: baseLayout('Réinitialisation de mot de passe', content),
  });
}

const STATUS_CONFIG = {
  paid: {
    label: 'Paiement confirmé',
    icon: '✓',
    color: '#2C7A4B',
    message: 'Votre paiement a bien été reçu. Nous préparons votre commande avec soin.',
    subject: 'Votre paiement a été confirmé',
  },
  processing: {
    label: 'En cours de préparation',
    icon: '⚙',
    color: '#A8884A',
    message: 'Votre commande est en cours de préparation dans notre atelier. Nous y mettons tout notre savoir-faire.',
    subject: 'Votre commande est en préparation',
  },
  shipped: {
    label: 'Expédiée',
    icon: '→',
    color: '#2C3A23',
    message: 'Votre commande a été confiée au transporteur et est en route vers vous.',
    subject: 'Votre commande a été expédiée',
  },
  delivered: {
    label: 'Livrée',
    icon: '✓',
    color: '#2C7A4B',
    message: 'Votre commande a été livrée. Nous espérons que vous apprécierez nos huiles d\'olive. Bon appétit !',
    subject: 'Votre commande a été livrée',
  },
  cancelled: {
    label: 'Annulée',
    icon: '✕',
    color: '#8B3A3A',
    message: 'Votre commande a été annulée. Si vous avez des questions, n\'hésitez pas à nous contacter.',
    subject: 'Votre commande a été annulée',
  },
};

export async function sendOrderStatusUpdate({ order, customerName, customerEmail }) {
  const config = STATUS_CONFIG[order.status];
  if (!config) return;

  const orderId = String(order._id).slice(-8).toUpperCase();
  const currency = order.currency || 'TND';

  const content = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.gold};font-family:Arial,sans-serif;">
      Mise à jour de commande
    </p>
    <h2 style="margin:8px 0 0;font-size:22px;color:${COLORS.primary};font-family:Georgia,serif;font-weight:normal;">
      ${config.subject}
    </h2>
    <p style="margin:16px 0 0;font-size:14px;color:${COLORS.muted};font-family:Arial,sans-serif;line-height:1.7;">
      Bonjour ${customerName},
    </p>

    <div style="margin:24px 0;padding:20px 24px;border-left:4px solid ${config.color};background:${COLORS.bg};">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;">
        Statut de la commande #DF-${orderId}
      </p>
      <p style="margin:0 0 8px;font-size:18px;font-family:Georgia,serif;color:${config.color};font-weight:bold;">
        ${config.label}
      </p>
      <p style="margin:0;font-size:14px;color:${COLORS.text};font-family:Arial,sans-serif;line-height:1.7;">
        ${config.message}
      </p>
    </div>

    ${order.status === 'shipped' && order.trackingNumber ? `
    <div style="margin:0 0 24px;padding:20px 24px;background:#F0F4EE;border:1px solid #C8D8C4;border-radius:4px;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,sans-serif;">
        Numéro de suivi
      </p>
      ${order.carrier ? `<p style="margin:0 0 4px;font-size:12px;color:${COLORS.muted};font-family:Arial,sans-serif;">${order.carrier}</p>` : ''}
      <p style="margin:0;font-size:22px;font-family:Georgia,serif;color:${COLORS.primary};letter-spacing:3px;font-weight:bold;">
        ${order.trackingNumber}
      </p>
      <p style="margin:10px 0 0;font-size:12px;color:${COLORS.muted};font-family:Arial,sans-serif;">
        Utilisez ce numéro pour suivre votre colis sur le site du transporteur.
      </p>
    </div>
    ` : ''}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:${COLORS.bg};padding:16px 20px;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:13px;color:${COLORS.muted};">Référence</td>
        <td style="text-align:right;font-family:Georgia,serif;font-size:14px;color:${COLORS.primary};letter-spacing:1px;">#DF-${orderId}</td>
      </tr>
      <tr>
        <td style="padding-top:8px;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.muted};">Total TTC</td>
        <td style="padding-top:8px;text-align:right;font-family:Georgia,serif;font-size:14px;color:${COLORS.gold};">${formatCurrency(order.totalTTC, currency)}</td>
      </tr>
      <tr>
        <td style="padding-top:8px;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.muted};">Articles</td>
        <td style="padding-top:8px;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:${COLORS.text};">
          ${order.items.map(i => `${i.productName}${i.volume ? ` (${i.volume})` : ''} ×${i.quantity}`).join('<br/>')}
        </td>
      </tr>
    </table>

    <p style="margin:32px 0 0;font-size:13px;color:${COLORS.muted};font-family:Arial,sans-serif;line-height:1.7;text-align:center;font-style:italic;">
      Pour toute question, contactez-nous à<br/>
      <a href="mailto:contact@domainefendri.com" style="color:${COLORS.gold};text-decoration:none;">contact@domainefendri.com</a>
    </p>
  `;

  await send({
    to: customerEmail,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `Domaine Fendri — ${config.subject} (#DF-${orderId})`,
    html: baseLayout(config.subject, content),
  });
}
