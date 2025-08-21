import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './config/database.js';
import config from './config/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import spinRoutes from './routes/spin.js';
import adsRoutes from './routes/ads.js';
import devicesRoutes from './routes/devices.js';
import walletRoutes from './routes/wallet.js';
import withdrawalsRoutes from './routes/withdrawals.js';
import streakRoutes from './routes/streak.js';
import referralsRoutes from './routes/referrals.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true
}));

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Spin & Earn API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/healthz',
      auth: '/api/v1/auth',
      spin: '/api/v1/spin',
      ads: '/api/v1/ads',
      devices: '/api/v1/devices',
      wallet: '/api/v1/wallet',
      withdrawals: '/api/v1/withdrawals',
      streak: '/api/v1/streak',
      referrals: '/api/v1/referrals',
      admin: '/api/v1/admin'
    }
  });
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/spin', spinRoutes);
app.use('/api/v1/ads', adsRoutes);
app.use('/api/v1/devices', devicesRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/withdrawals', withdrawalsRoutes);
app.use('/api/v1/streak', streakRoutes);
app.use('/api/v1/referrals', referralsRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
