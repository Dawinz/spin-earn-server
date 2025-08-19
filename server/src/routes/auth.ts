import { Router } from 'express';
import { AuthController, registerValidation, loginValidation } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /auth/register
router.post('/register', authLimiter, registerValidation, AuthController.register);

// POST /auth/login
router.post('/login', authLimiter, loginValidation, AuthController.login);

// POST /auth/refresh
router.post('/refresh', AuthController.refreshToken);

// POST /auth/logout
router.post('/logout', AuthController.logout);

// POST /auth/magic-link
router.post('/magic-link', authLimiter, AuthController.magicLink);

// POST /auth/verify-magic-link
router.post('/verify-magic-link', AuthController.verifyMagicLink);

export default router;
