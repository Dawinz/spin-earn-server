import WithdrawalRequest from '../models/WithdrawalRequest.js';
import User from '../models/User.js';
import Config from '../models/Config.js';
import logger from '../utils/logger.js';

export interface WithdrawalData {
  amount: number;
  method: string;
  notes?: string;
}

export class WithdrawalsService {
  static async getWithdrawals(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const withdrawals = await WithdrawalRequest.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await WithdrawalRequest.countDocuments({ userId });

      return {
        withdrawals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting withdrawals', { userId, error });
      throw error;
    }
  }

  static async createWithdrawal(userId: string, data: WithdrawalData): Promise<any> {
    try {
      // Get withdrawal config
      const config = await Config.findOne({ key: 'spin_earn_policy' });
      const withdrawalConfig = config?.json?.withdrawals || { min: 1000, fee: 0.05, cooldownHours: 24 };

      // Check minimum withdrawal amount
      if (data.amount < withdrawalConfig.min) {
        throw new Error(`Minimum withdrawal amount is ${withdrawalConfig.min} coins`);
      }

      // Check user balance
      const user = await User.findById(userId);
      if (!user || user.balances.coins < data.amount) {
        throw new Error('Insufficient balance');
      }

      // Check cooldown (last withdrawal within cooldown period)
      const cooldownDate = new Date();
      cooldownDate.setHours(cooldownDate.getHours() - withdrawalConfig.cooldownHours);

      const recentWithdrawal = await WithdrawalRequest.findOne({
        userId,
        createdAt: { $gte: cooldownDate }
      });

      if (recentWithdrawal) {
        throw new Error(`Withdrawal cooldown active. Try again in ${withdrawalConfig.cooldownHours} hours`);
      }

      // Calculate fee
      const fee = data.amount * withdrawalConfig.fee;
      const netAmount = data.amount - fee;

      // Create withdrawal request
      const withdrawal = new WithdrawalRequest({
        userId,
        amount: data.amount,
        netAmount,
        fee,
        method: data.method,
        notes: data.notes,
        status: 'pending'
      });

      await withdrawal.save();

      // Deduct coins from user balance
      user.balances.coins -= data.amount;
      await user.save();

      logger.info('Withdrawal request created', { 
        userId, 
        withdrawalId: withdrawal._id, 
        amount: data.amount 
      });

      return withdrawal;
    } catch (error) {
      logger.error('Error creating withdrawal', { userId, error });
      throw error;
    }
  }
}
