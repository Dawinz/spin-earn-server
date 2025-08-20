import { Router } from 'express';
import { ReferralsController, applyReferralValidation } from '../controllers/referralsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply authentication to all referral routes
router.use(authenticateToken);

// POST /referrals/apply - Apply referral code
router.post('/apply', apiLimiter, applyReferralValidation, ReferralsController.applyReferral);

export default router;
