import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const { email, password, deviceInfo, referralCode } = req.body;

      const result = await AuthService.register({
        email,
        password,
        deviceInfo: {
          ...deviceInfo,
          ipAddress: req.ip
        },
        referralCode
      });

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const { email, password, deviceInfo } = req.body;

      const result = await AuthService.login({
        email,
        password,
        deviceInfo: {
          ...deviceInfo,
          ipAddress: req.ip
        }
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }

      const result = await AuthService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a more sophisticated implementation, you might want to blacklist the token
      // For now, we'll just return success
      logger.info('User logged out', { userId: req.user?._id });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async magicLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ValidationError('Email is required');
      }

      // Generate magic link token
      const token = AuthService.generateMagicLinkToken(email);

      // In a real implementation, you'd send this via email
      // For now, we'll just return it (for testing purposes)
      logger.info('Magic link requested', { email });

      res.json({
        success: true,
        message: 'Magic link sent to your email',
        data: {
          token // Remove this in production
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyMagicLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        throw new ValidationError('Token is required');
      }

      const decoded = AuthService.verifyMagicLinkToken(token);
      
      // Find or create user
      // This is a simplified implementation
      res.json({
        success: true,
        message: 'Magic link verified successfully',
        data: {
          email: decoded.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('deviceInfo.fingerprintHash').notEmpty().withMessage('Device fingerprint is required'),
  body('deviceInfo.model').notEmpty().withMessage('Device model is required'),
  body('deviceInfo.os').notEmpty().withMessage('Device OS is required'),
  body('deviceInfo.emulator').isBoolean().withMessage('Emulator flag must be boolean'),
  body('deviceInfo.rooted').isBoolean().withMessage('Rooted flag must be boolean'),
  body('referralCode').optional().isString().withMessage('Referral code must be string')
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('deviceInfo.fingerprintHash').notEmpty().withMessage('Device fingerprint is required'),
  body('deviceInfo.model').notEmpty().withMessage('Device model is required'),
  body('deviceInfo.os').notEmpty().withMessage('Device OS is required'),
  body('deviceInfo.emulator').isBoolean().withMessage('Emulator flag must be boolean'),
  body('deviceInfo.rooted').isBoolean().withMessage('Rooted flag must be boolean')
];
