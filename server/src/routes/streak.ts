import { Router } from 'express';
import { StreakController } from '../controllers/streakController.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply authentication to all streak routes
router.use(authenticateToken);

// POST /streak/claim - Claim daily streak reward
router.post('/claim', apiLimiter, StreakController.claimStreak);

export default router;
