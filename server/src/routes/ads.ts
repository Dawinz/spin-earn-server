import { Router } from 'express';
import { AdsController, ssvValidation } from '../controllers/adsController.js';

const router = Router();

// POST /ads/ssv - AdMob Server-Side Verification webhook
router.post('/ssv', ssvValidation, AdsController.ssvWebhook);

export default router;
