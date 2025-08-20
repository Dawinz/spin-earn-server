import { Router } from 'express';
import { DevicesController, registerDeviceValidation, reportEnvValidation } from '../controllers/devicesController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /devices/register
router.post('/register', authLimiter, registerDeviceValidation, DevicesController.registerDevice);

// POST /devices/report-env
router.post('/report-env', authLimiter, reportEnvValidation, DevicesController.reportEnvironment);

export default router;
