import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { sanitizeBody } from './middleware/validate.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import configuratorRoutes from './routes/configurator.js';
import contactRoutes from './routes/contact.js';
import checkoutRoutes from './routes/checkout.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.set('trust proxy', 1);

app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }));

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : false)
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(morgan('dev'));
app.use(globalLimiter);
app.use(sanitizeBody);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/configurator', configuratorRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use((_req, res) => res.status(404).json({ message: 'Route introuvable' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.type === 'entity.too.large')
    return res.status(413).json({ message: 'Requête trop volumineuse (50kb max)' });
  res.status(500).json({ message: 'Erreur serveur interne' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Fendri démarrée sur le port ${PORT}`);
  connectDB();
});
