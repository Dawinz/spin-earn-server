import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.js';
import { WithdrawalsService } from '../services/withdrawalsService.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class WithdrawalsController {
  static async getWithdrawals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { page = 1, limit = 20 } = req.query;

      const withdrawals = await WithdrawalsService.getWithdrawals(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: withdrawals
      });
    } catch (error) {
      next(error);
    }
  }

  static async createWithdrawal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const userId = req.user!._id.toString();
      const { amount, method, notes } = req.body;

      const withdrawal = await WithdrawalsService.createWithdrawal(userId, {
        amount,
        method,
        notes
      });

      res.status(201).json({
        success: true,
        data: withdrawal
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const createWithdrawalValidation = [
  body('amount').isNumeric().withMessage('Amount must be numeric'),
  body('method').isIn(['mobile_money', 'bank_transfer', 'paypal']).withMessage('Invalid withdrawal method'),
  body('notes').optional().isString().withMessage('Notes must be string')
];
