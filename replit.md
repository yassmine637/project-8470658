# Domaine Fendri — Application E-commerce

Application e-commerce complète pour l'huile d'olive Domaine Fendri. Frontend React + Vite, backend Express + MongoDB.

## Architecture

- **Frontend** : React 19 + Vite + TypeScript + TailwindCSS (port 5000)
- **Backend** : Express.js sur port 3001 (dev), MongoDB via Mongoose
- **Proxy** : Vite redirige `/api/*` → `localhost:3001`

## Structure du projet

```
server/
  config/db.js          — Connexion MongoDB avec retry auto
  middleware/auth.js    — JWT protect + admin middleware
  models/               — User, Product, Order, ConfiguratorOrder, ContactMessage
  routes/               — auth, products, orders, configurator, contact, checkout, admin
  index.js              — Express entry point (port 3001)
  seed.js               — Peuple la DB avec 4 produits

src/
  api/                  — Services API (client, auth, products, orders, configurator, contact, checkout, admin)
  hooks/useAuth.tsx     — AuthContext JWT (login, register, logout)
  pages/
    auth/page.tsx       — Page login/register
    admin/page.tsx      — Dashboard admin (commandes, messages, configurateur)
    checkout/success.tsx — Page succès paiement Stripe
    checkout/cancel.tsx  — Page annulation paiement
  components/feature/
    CartDrawer.tsx      — Panier → POST /api/orders
  pages/home/components/
    Contact.tsx         — Formulaire → POST /api/contact
  pages/configurator/components/
    EstimationModal.tsx — Devis → POST /api/configurator
```

## Routes API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Créer un compte |
| POST | /api/auth/login | Connexion JWT |
| GET | /api/auth/me | Profil utilisateur (auth) |
| GET | /api/products | Liste des produits |
| GET | /api/products/:slug | Produit par slug |
| POST | /api/orders | Créer commande (guest) |
| POST | /api/orders/authenticated | Créer commande (auth) |
| GET | /api/orders/my | Mes commandes (auth) |
| POST | /api/configurator | Soumettre devis configurateur |
| POST | /api/contact | Envoyer message contact |
| POST | /api/checkout/create-session | Créer session Stripe |
| POST | /api/checkout/webhook | Webhook Stripe |
| GET | /api/admin/* | Dashboard admin (auth + admin) |
| GET | /api/health | Health check |

## Secrets requis

| Clé | Status | Description |
|-----|--------|-------------|
| `MONGODB_URI` | ✅ Configuré | URI MongoDB Atlas |
| `JWT_SECRET` | ⚠️ Optionnel | Défaut: fendri_jwt_secret_2025 |
| `STRIPE_SECRET_KEY` | ❌ Non configuré | Pour paiements Stripe |
| `SENDGRID_API_KEY` | ❌ Non configuré | Pour emails transactionnels |

## Workflows

- **Start application** : `npm run dev` → port 5000 (webview)
- **API Backend** : `nodemon --watch server server/index.js` → port 3001 (console)

## Compte admin

- **Email** : admin@fendri.com
- **Password** : Admin2025!
- **Role** : admin

## Commandes utiles

```bash
npm run dev          # Lance le frontend Vite
npm run server:dev   # Lance le backend Express (nodemon)
npm run seed         # Peuple la DB avec les produits
```

## Préférences utilisateur

- Interface française pour les messages d'erreur et labels API
- Prix en TND (dinar tunisien) avec TVA 19%
- Multilangue: FR / AR / EN via i18next
