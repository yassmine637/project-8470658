# Fendri — Luxury E-Commerce & Product Configurator

## Project Overview

A high-end, luxury e-commerce and product customization platform (Fendri brand) built with React + TypeScript + Vite. Features a landing page, product catalog, and a sophisticated 3D-like product configurator for bespoke bottles (perfumes/spirits).

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 3, PostCSS
- **Routing:** React Router 7
- **Internationalization:** i18next (English & French)
- **Icons:** Lucide React, Remix Icon
- **Services:** Firebase, Supabase, Stripe (in dependencies)
- **Charts:** Recharts

## Project Structure

```
src/
  assets/         Static assets and image mappings
  components/
    base/         Low-level reusable components
    feature/      Domain-specific components (CartDrawer, Header, etc.)
  hooks/          Custom React hooks (useCart, useCurrency)
  i18n/           Translation files and i18n config
  mocks/          Mock data (products, configurator)
  pages/
    home/         Landing page sections (Hero, About, Awards, etc.)
    products/     Product listing page
    configurator/ 3D-like product customization wizard
  router/         Routing config and AppRoutes
  App.tsx
  main.tsx
eslint-rules/     Custom ESLint rules
```

## Dev Setup

- **Package Manager:** npm
- **Dev server:** `npm run dev` — runs on port 5000 (0.0.0.0)
- **Build output:** `out/` directory
- **Path alias:** `@` maps to `src/`
- **Auto-imports:** React hooks, react-router-dom, react-i18next via unplugin-auto-import

## Deployment

- **Type:** Static site
- **Build command:** `npm run build`
- **Public directory:** `out/`

## Key Features

- Multi-step product configurator with real-time bottle preview
- Cart system with CartProvider context and CartDrawer
- Multi-language support (EN/FR)
- AI assistant integration (ReaddyAgent component)
- Product videos are displayed on the products page; the 1L bidon uses `attached_assets/1L_1776459416660.mp4`, the 500ml bottle uses `attached_assets/500ml_1776458561147.mp4`, the 750ml bottle uses `attached_assets/750ml_1776459284079.mp4`, and the 3L bidon uses `attached_assets/3L_1776459633650.mp4`.
- The products page preloads product videos in the background so bottle animations start faster after selection.
