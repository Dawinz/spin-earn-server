import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { StreakService } from '../services/streakService.js';
import logger from '../utils/logger.js';

export class StreakController {
  static async claimStreak(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const result = await StreakService.claimStreak(userId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
