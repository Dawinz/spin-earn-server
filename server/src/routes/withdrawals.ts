import { Router } from 'express';
import { WithdrawalsController, createWithdrawalValidation } from '../controllers/withdrawalsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply authentication to all withdrawal routes
router.use(authenticateToken);

// GET /withdrawals - Get user's withdrawal requests
router.get('/', apiLimiter, WithdrawalsController.getWithdrawals);

// POST /withdrawals - Create withdrawal request
router.post('/', apiLimiter, createWithdrawalValidation, WithdrawalsController.createWithdrawal);

export default router;
