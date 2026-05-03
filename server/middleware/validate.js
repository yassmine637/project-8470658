const strip = (str) =>
  typeof str === 'string'
    ? str.replace(/<[^>]*>/g, '').replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
      ).trim()
    : str;

export const sanitizeBody = (req, _res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') obj[key] = strip(obj[key]);
      else if (typeof obj[key] === 'object') sanitize(obj[key]);
    }
    return obj;
  };
  req.body = sanitize(req.body);
  next();
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAuth = (req, res, next) => {
  const { email, password, name } = req.body;
  if (email && !EMAIL_RE.test(email))
    return res.status(400).json({ message: 'Adresse email invalide' });
  if (password && password.length < 6)
    return res.status(400).json({ message: 'Mot de passe trop court (6 caractères minimum)' });
  if (name !== undefined && name.length < 2)
    return res.status(400).json({ message: 'Le nom doit faire au moins 2 caractères' });
  next();
};

export const validateContact = (req, res, next) => {
  const { nom, prenom, email, sujet, message } = req.body;
  if (!nom || !prenom || !email || !sujet || !message)
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
  if (!EMAIL_RE.test(email))
    return res.status(400).json({ message: 'Adresse email invalide' });
  if (nom.length > 100 || prenom.length > 100)
    return res.status(400).json({ message: 'Nom trop long' });
  if (sujet.length > 200)
    return res.status(400).json({ message: 'Sujet trop long (200 caractères max)' });
  if (message.length > 2000)
    return res.status(400).json({ message: 'Message trop long (2000 caractères max)' });
  next();
};

export const validateOrder = (req, res, next) => {
  const { items, guestEmail, guestName } = req.body;
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: 'Panier vide' });
  if (items.length > 50)
    return res.status(400).json({ message: 'Trop d\'articles dans le panier' });
  for (const item of items) {
    if (!item.productName || typeof item.price !== 'number' || item.price < 0)
      return res.status(400).json({ message: 'Article invalide dans le panier' });
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000)
      return res.status(400).json({ message: 'Quantité invalide' });
  }
  if (guestEmail && !EMAIL_RE.test(guestEmail))
    return res.status(400).json({ message: 'Email invalide' });
  if (guestName && guestName.length > 200)
    return res.status(400).json({ message: 'Nom trop long' });
  next();
};

export const validateConfigurator = (req, res, next) => {
  const { name, email, quantity, totalHT, totalTTC } = req.body;
  if (!name || name.length < 2 || name.length > 200)
    return res.status(400).json({ message: 'Nom invalide' });
  if (!email || !EMAIL_RE.test(email))
    return res.status(400).json({ message: 'Email invalide' });
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000))
    return res.status(400).json({ message: 'Quantité invalide' });
  if (totalHT !== undefined && (typeof totalHT !== 'number' || totalHT < 0))
    return res.status(400).json({ message: 'Montant invalide' });
  if (totalTTC !== undefined && (typeof totalTTC !== 'number' || totalTTC < 0))
    return res.status(400).json({ message: 'Montant TTC invalide' });
  next();
};
