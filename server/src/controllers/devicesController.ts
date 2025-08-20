import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { DevicesService } from '../services/devicesService.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class DevicesController {
  static async registerDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const { userId, deviceInfo } = req.body;

      const result = await DevicesService.registerDevice(userId, {
        ...deviceInfo,
        ipAddress: req.ip
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async reportEnvironment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const { userId, environment } = req.body;

      await DevicesService.reportEnvironment(userId, environment);

      res.json({
        success: true,
        message: 'Environment reported successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const registerDeviceValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('deviceInfo.fingerprintHash').notEmpty().withMessage('Device fingerprint is required'),
  body('deviceInfo.model').notEmpty().withMessage('Device model is required'),
  body('deviceInfo.os').notEmpty().withMessage('Device OS is required'),
  body('deviceInfo.emulator').isBoolean().withMessage('Emulator flag must be boolean'),
  body('deviceInfo.rooted').isBoolean().withMessage('Rooted flag must be boolean')
];

export const reportEnvValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('environment').isObject().withMessage('Environment must be an object')
];
