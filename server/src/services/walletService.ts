import User from '../models/User.js';
import WalletTx from '../models/WalletTx.js';
import logger from '../utils/logger.js';

export class WalletService {
  static async getWallet(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId).select('balances');
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        balances: user.balances,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error getting wallet', { userId, error });
      throw error;
    }
  }

  static async getTransactions(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const transactions = await WalletTx.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await WalletTx.countDocuments({ userId });

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting transactions', { userId, error });
      throw error;
    }
  }
}
