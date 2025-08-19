import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { SpinService } from '../services/spinService.js';
import { AuthRequest } from '../middleware/auth.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class SpinController {
  static async prefetch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const result = await SpinService.prefetch(userId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async startSpin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const userId = req.user!._id.toString();
      const { method } = req.body;

      const result = await SpinService.startSpin(
        userId,
        method,
        req.ip || 'unknown',
        req.get('User-Agent') || ''
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmSpin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const userId = req.user!._id.toString();
      const { signature, method } = req.body;

      const result = await SpinService.confirmSpin(
        userId,
        signature,
        method,
        req.ip || 'unknown',
        req.get('User-Agent') || ''
      );

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
export const startSpinValidation = [
  body('method').isIn(['free', 'rewarded']).withMessage('Method must be either free or rewarded')
];

export const confirmSpinValidation = [
  body('signature').notEmpty().withMessage('Signature is required'),
  body('method').isIn(['free', 'rewarded']).withMessage('Method must be either free or rewarded')
];
