import { Router } from 'express';
import { SpinController, startSpinValidation, confirmSpinValidation } from '../controllers/spinController.js';
import { authenticateToken } from '../middleware/auth.js';
import { spinLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All spin routes require authentication
router.use(authenticateToken);

// GET /spin/prefetch
router.get('/prefetch', SpinController.prefetch);

// POST /spin/start
router.post('/start', spinLimiter, startSpinValidation, SpinController.startSpin);

// POST /spin/confirm
router.post('/confirm', spinLimiter, confirmSpinValidation, SpinController.confirmSpin);

export default router;
