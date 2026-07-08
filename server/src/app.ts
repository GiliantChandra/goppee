import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit.middleware';
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/accounts.routes';
import transactionRoutes from './routes/transactions.routes';
import pocketRoutes from './routes/pockets.routes';
import valasRoutes from './routes/valas.routes';
import topupRoutes from './routes/topup.routes';

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));

// ─── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' })); // limit payload size
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── Trust Proxy (for Nginx / Railway) ───────────────────────────────────────
app.set('trust proxy', 1);

// ─── Global Rate Limit ────────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── Health Check (no auth) ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoMode: config.DEMO_MODE,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/pockets', pocketRoutes);
app.use('/api/valas', valasRoutes);
app.use('/api/topup', topupRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message);
  // Never expose internal errors to clients
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`\n🚀 NovaPay API running on port ${PORT}`);
  console.log(`   ENV: ${config.NODE_ENV}`);
  console.log(`   DEMO_MODE: ${config.DEMO_MODE}`);
  console.log(`   CORS: ${config.CORS_ORIGIN}`);
  if (config.DEMO_MODE) {
    console.log('\n⚠️  DEMO_MODE enabled — OTPs printed to console, not sent via SMS/email');
  }
});

export default app;
