import User from '../models/User.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import SpinSession from '../models/SpinSession.js';
import WalletTx from '../models/WalletTx.js';
import Config from '../models/Config.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class AdminService {
  // User Management
  static async getUsers(page: number, limit: number, search: string = '') {
    try {
      const skip = (page - 1) * limit;
      
      // Build search query
      const searchQuery = search 
        ? { email: { $regex: search, $options: 'i' } }
        : {};

      // Get users with pagination
      const users = await User.find(searchQuery)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const total = await User.countDocuments(searchQuery);

      // Transform data for admin dashboard
      const transformedUsers = users.map(user => ({
        id: (user._id as any).toString(),
        email: user.email,
        joinDate: user.createdAt,
        coins: user.balances.coins,
        streak: user.streak.current,
        status: user.flags.blocked ? 'blocked' : 'active',
        roles: user.roles,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        devicePrimaryId: user.devicePrimaryId,
        shadowBanned: user.flags.shadowBanned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      return {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  static async blockUser(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      user.flags.blocked = true;
      await user.save();

      logger.info(`User ${user.email} blocked by admin`);

      return {
        message: 'User blocked successfully',
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          status: 'blocked'
        }
      };
    } catch (error) {
      logger.error('Error blocking user:', error);
      throw error;
    }
  }

  static async unblockUser(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      user.flags.blocked = false;
      await user.save();

      logger.info(`User ${user.email} unblocked by admin`);

      return {
        message: 'User unblocked successfully',
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          status: 'active'
        }
      };
    } catch (error) {
      logger.error('Error unblocking user:', error);
      throw error;
    }
  }

  // Withdrawal Management
  static async getWithdrawals(page: number, limit: number, status: string = 'all') {
    try {
      const skip = (page - 1) * limit;
      
      // Build status filter
      const statusFilter = status === 'all' ? {} : { status };

      // Get withdrawals with user data
      const withdrawals = await WithdrawalRequest.find(statusFilter)
        .populate('userId', 'email')
        .populate('processedBy', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const total = await WithdrawalRequest.countDocuments(statusFilter);

      // Transform data for admin dashboard
      const transformedWithdrawals = withdrawals.map(withdrawal => ({
        id: (withdrawal._id as any).toString(),
        userId: (withdrawal.userId._id as any).toString(),
        userEmail: (withdrawal.userId as any).email,
        amount: withdrawal.amount,
        status: withdrawal.status,
        method: withdrawal.method,
        accountInfo: withdrawal.accountInfo || 'N/A',
        requestDate: withdrawal.createdAt,
        notes: withdrawal.notes,
        processedBy: withdrawal.processedBy ? (withdrawal.processedBy as any).email : null,
        processedAt: withdrawal.processedAt,
        createdAt: withdrawal.createdAt,
        updatedAt: withdrawal.updatedAt
      }));

      return {
        withdrawals: transformedWithdrawals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting withdrawals:', error);
      throw error;
    }
  }

  static async approveWithdrawal(withdrawalId: string, adminUserId: string) {
    try {
      const withdrawal = await WithdrawalRequest.findById(withdrawalId);
      if (!withdrawal) {
        throw new NotFoundError('Withdrawal request not found');
      }

      if (withdrawal.status !== 'pending') {
        throw new ValidationError('Withdrawal is not pending');
      }

      // Update withdrawal status
      withdrawal.status = 'approved';
      withdrawal.processedBy = adminUserId as any;
      withdrawal.processedAt = new Date();
      await withdrawal.save();

      // Create wallet transaction for the withdrawal
      const user = await User.findById(withdrawal.userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Deduct coins from user balance
      user.balances.coins -= withdrawal.amount;
      if (user.balances.coins < 0) {
        throw new ValidationError('Insufficient balance');
      }
      await user.save();

      // Record wallet transaction
      await WalletTx.create({
        userId: withdrawal.userId,
        type: 'debit',
        amount: withdrawal.amount,
        balanceAfter: user.balances.coins,
        origin: 'withdrawal',
        referenceId: withdrawal._id
      });

      logger.info(`Withdrawal ${withdrawalId} approved by admin ${adminUserId}`);

      return {
        message: 'Withdrawal approved successfully',
        withdrawal: {
          id: (withdrawal._id as any).toString(),
          status: 'approved',
          processedAt: withdrawal.processedAt
        }
      };
    } catch (error) {
      logger.error('Error approving withdrawal:', error);
      throw error;
    }
  }

  static async rejectWithdrawal(withdrawalId: string, reason: string, adminUserId: string) {
    try {
      const withdrawal = await WithdrawalRequest.findById(withdrawalId);
      if (!withdrawal) {
        throw new NotFoundError('Withdrawal request not found');
      }

      if (withdrawal.status !== 'pending') {
        throw new ValidationError('Withdrawal is not pending');
      }

      // Update withdrawal status
      withdrawal.status = 'rejected';
      withdrawal.processedBy = adminUserId as any;
      withdrawal.processedAt = new Date();
      withdrawal.notes = reason;
      await withdrawal.save();

      logger.info(`Withdrawal ${withdrawalId} rejected by admin ${adminUserId}: ${reason}`);

      return {
        message: 'Withdrawal rejected successfully',
        withdrawal: {
          id: (withdrawal._id as any).toString(),
          status: 'rejected',
          processedAt: withdrawal.processedAt,
          notes: reason
        }
      };
    } catch (error) {
      logger.error('Error rejecting withdrawal:', error);
      throw error;
    }
  }

  // Analytics
  static async getDashboardStats() {
    try {
      // Get basic counts
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ 'flags.blocked': false });
      const blockedUsers = await User.countDocuments({ 'flags.blocked': true });
      const totalSpins = await SpinSession.countDocuments();
      const pendingWithdrawals = await WithdrawalRequest.countDocuments({ status: 'pending' });

      // Get total coins in circulation
      const totalCoinsResult = await User.aggregate([
        { $group: { _id: null, totalCoins: { $sum: '$balances.coins' } } }
      ]);
      const totalCoins = totalCoinsResult[0]?.totalCoins || 0;

      // Get total withdrawals
      const totalWithdrawals = await WithdrawalRequest.countDocuments();

      // Calculate average spins per user
      const avgSpinsPerUser = totalUsers > 0 ? (totalSpins / totalUsers).toFixed(1) : '0';

      // Get recent activity (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentSpins = await SpinSession.countDocuments({ createdAt: { $gte: yesterday } });
      const recentWithdrawals = await WithdrawalRequest.countDocuments({ createdAt: { $gte: yesterday } });

      return {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalSpins,
        pendingWithdrawals,
        totalCoins,
        totalWithdrawals,
        avgSpinsPerUser: parseFloat(avgSpinsPerUser),
        recentActivity: {
          spins: recentSpins,
          withdrawals: recentWithdrawals
        }
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  static async getDailyStats(days: number = 7) {
    try {
      const stats = [];
      const endDate = new Date();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Get daily user registrations
      const dailyUsers = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            users: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get daily spins
      const dailySpins = await SpinSession.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            spins: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get daily withdrawals
      const dailyWithdrawals = await WithdrawalRequest.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            withdrawals: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Combine all stats by date
      const dateMap = new Map();
      
      // Initialize all dates
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dateMap.set(dateStr, {
          date: dateStr,
          users: 0,
          spins: 0,
          withdrawals: 0
        });
      }

      // Fill in actual data
      dailyUsers.forEach(item => {
        if (dateMap.has(item._id)) {
          dateMap.get(item._id).users = item.users;
        }
      });

      dailySpins.forEach(item => {
        if (dateMap.has(item._id)) {
          dateMap.get(item._id).spins = item.spins;
        }
      });

      dailyWithdrawals.forEach(item => {
        if (dateMap.has(item._id)) {
          dateMap.get(item._id).withdrawals = item.withdrawals;
        }
      });

      return Array.from(dateMap.values());
    } catch (error) {
      logger.error('Error getting daily stats:', error);
      throw error;
    }
  }

  // Configuration
  static async getConfig(key: string) {
    try {
      const config = await Config.findOne({ key });
      if (!config) {
        throw new NotFoundError(`Config with key '${key}' not found`);
      }

      return config.json;
    } catch (error) {
      logger.error('Error getting config:', error);
      throw error;
    }
  }

  static async updateConfig(key: string, json: any) {
    try {
      const config = await Config.findOneAndUpdate(
        { key },
        { json },
        { upsert: true, new: true }
      );

      logger.info(`Config '${key}' updated by admin`);

      return config.json;
    } catch (error) {
      logger.error('Error updating config:', error);
      throw error;
    }
  }
}
