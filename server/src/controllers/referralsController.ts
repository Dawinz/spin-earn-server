import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.js';
import { ReferralsService } from '../services/referralsService.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class ReferralsController {
  static async applyReferral(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const userId = req.user!._id.toString();
      const { referralCode } = req.body;

      const result = await ReferralsService.applyReferral(userId, referralCode);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const applyReferralValidation = [
  body('referralCode').notEmpty().withMessage('Referral code is required')
];
