import { Router } from 'express';
import { WalletController } from '../controllers/walletController.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply authentication to all wallet routes
router.use(authenticateToken);

// GET /wallet - Get wallet balance and info
router.get('/', apiLimiter, WalletController.getWallet);

// GET /wallet/tx - Get transaction history
router.get('/tx', apiLimiter, WalletController.getTransactions);

export default router;
