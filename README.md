# Domaine Fendri — Application E-commerce

Application e-commerce complète pour l'huile d'olive bio tunisienne **Domaine Fendri** (fondée en 1911, Sfax).

Stack : **React 19** + **Vite** + **TypeScript** (frontend) · **Express 5** + **MongoDB** (backend)

---

## Fonctionnalités

- Catalogue produits avec configurateur de bouteilles personnalisé
- Panier d'achat avec checkout multi-devises (TND / EUR / USD)
- Paiement via **Stripe**, **PayPal**, et **Konnect** (Tunisie)
- Authentification JWT (inscription / connexion / profil)
- Dashboard administrateur (commandes, messages, configurateur)
- Interface multilingue : Français 🇫🇷 · Anglais 🇬🇧 · Arabe 🇹🇳
- Design responsive avec animations et lecteur vidéo intégré

---

## Installation

### Prérequis

- Node.js 20+
- npm 10+
- Compte [MongoDB Atlas](https://www.mongodb.com/atlas) (base de données)

### Démarrage rapide

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd domaine-fendri

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs (au minimum MONGODB_URI et JWT_SECRET)

# 4. Peupler la base de données
npm run seed           # Insère les 4 produits
node server/createAdmin.js  # Crée le compte admin

# 5. Lancer le projet (deux terminaux)
npm run dev            # Frontend Vite — http://localhost:5000
npm run server:dev     # Backend Express — http://localhost:3001
```

---

## Variables d'environnement

Copiez `.env.example` en `.env` et renseignez au minimum :

| Variable | Obligatoire | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | URI de connexion MongoDB Atlas |
| `JWT_SECRET` | ✅ | Clé secrète pour les tokens JWT |
| `STRIPE_SECRET_KEY` | ⚠️ Optionnel | Paiements Stripe |
| `KONNECT_API_KEY` | ⚠️ Optionnel | Paiements Konnect (TND) |
| `PAYPAL_CLIENT_ID` | ⚠️ Optionnel | Paiements PayPal |
| `SENDGRID_API_KEY` | ⚠️ Optionnel | Emails transactionnels |

> ⚠️ **Ne commitez jamais** le fichier `.env` — il est déjà dans `.gitignore`.

---

## Scripts disponibles

```bash
npm run dev          # Lance le frontend Vite (port 5000)
npm run server       # Lance le backend Express en production
npm run server:dev   # Lance le backend avec rechargement auto (nodemon)
npm run build        # Build de production (sortie dans /out)
npm run seed         # Peuple la DB avec les 4 produits
npm test             # Lance les tests unitaires (Vitest)
npm run lint         # Vérifie la qualité du code (ESLint)
npm run type-check   # Vérification TypeScript sans compilation
```

---

## Architecture

```
├── server/                    # Backend Express
│   ├── config/db.js           # Connexion MongoDB
│   ├── middleware/            # Auth JWT, rate limiting, validation
│   ├── models/                # Mongoose : User, Product, Order, ConfiguratorOrder, ContactMessage
│   ├── routes/                # auth, products, orders, configurator, contact, checkout, admin
│   ├── index.js               # Point d'entrée Express (port 3001)
│   └── seed.js                # Script de peuplement des produits
│
├── src/                       # Frontend React
│   ├── api/                   # Services API typés (auth, products, orders, checkout…)
│   ├── components/            # Composants réutilisables (Header, Footer, CartDrawer…)
│   ├── hooks/                 # useAuth, useCart, useCurrency, useReveal
│   ├── i18n/                  # Traductions FR / EN / AR
│   ├── mocks/                 # Données locales produits
│   ├── pages/                 # Vues : home, products, configurator, auth, admin, checkout
│   ├── router/                # Configuration des routes React Router
│   └── __tests__/             # Tests unitaires Vitest
│
├── public/                    # Assets statiques
├── attached_assets/           # Images et vidéos produits
├── .env.example               # Template des variables d'environnement
└── vite.config.ts             # Configuration Vite + proxy API
```

---

## Compte administrateur

Après avoir exécuté `node server/createAdmin.js` :

| Champ | Valeur |
|---|---|
| Email | `admin@fendri.com` |
| Mot de passe | `Admin2025!` |
| Dashboard | `/admin` |

---

## Tests

```bash
npm test              # Lance tous les tests
npm test -- --coverage  # Avec couverture de code
```

Les tests couvrent :
- **`useCart`** : ajout, suppression, mise à jour quantité, vidage panier, état du tiroir
- **`useAuth`** : login, logout, inscription, restauration de session, token invalide

---

## Paiements

Les trois passerelles sont optionnelles et activées uniquement si les clés sont configurées :

- **Konnect** (défaut pour la Tunisie) — paie en TND via carte, wallet ou e-DINAR
- **PayPal** — paie en EUR via compte PayPal ou carte
- **Stripe** — paie en EUR/USD/GBP via carte bancaire

Si aucune clé n'est configurée, le checkout affiche un message d'erreur explicite.
