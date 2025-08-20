import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { WalletService } from '../services/walletService.js';
import logger from '../utils/logger.js';

export class WalletController {
  static async getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const wallet = await WalletService.getWallet(userId);

      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { page = 1, limit = 20 } = req.query;

      const transactions = await WalletService.getTransactions(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }
}
