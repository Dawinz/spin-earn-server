import { Request, Response } from 'express';
import User from '../models/User.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import logger from '../utils/logger.js';

// Get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    // Transform user data to match frontend expectations
    const transformedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      joinDate: user.createdAt,
      coins: user.currentBalance,
      streak: user.streakDays,
      status: user.isBlocked ? 'blocked' : 'active'
    }));
    
    res.json({
      data: {
        users: transformedUsers,
        total: users.length
      }
    });
    
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get withdrawal requests (admin only)
export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const withdrawals = await WithdrawalRequest.find({})
      .populate('userId', 'email currentBalance')
      .sort({ createdAt: -1 });
    
    // Transform withdrawal data to match frontend expectations
    const transformedWithdrawals = withdrawals.map(withdrawal => {
      const populatedUser = withdrawal.userId as any;
      return {
        id: withdrawal._id,
        userId: populatedUser._id || populatedUser,
        userEmail: populatedUser.email || 'Unknown', // Extract email from populated user
        amount: withdrawal.amount,
        status: withdrawal.status,
        requestDate: withdrawal.createdAt,
        method: withdrawal.method,
        accountInfo: withdrawal.accountInfo
      };
    });
    
    res.json({
      data: {
        withdrawals: transformedWithdrawals,
        total: withdrawals.length
      }
    });
    
  } catch (error) {
    logger.error('Get withdrawals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get analytics (admin only)
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalEarnings = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);
    const totalWithdrawn = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalWithdrawn' } } }
    ]);
    const totalCoins = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$currentBalance' } } }
    ]);
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    
    const pendingWithdrawals = await WithdrawalRequest.countDocuments({ status: 'pending' });
    
    // Get total spins (simplified - in real app you'd count from SpinSession)
    const totalSpins = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$dailySpinCount' } } }
    ]);
    
    // Calculate active users (users who have logged in recently)
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    
    // Calculate average spins per user
    const avgSpinsPerUser = totalUsers > 0 ? Math.round((totalSpins[0]?.total || 0) / totalUsers) : 0;
    
    res.json({
      data: {
        totalUsers,
        totalSpins: totalSpins[0]?.total || 0,
        activeUsers,
        pendingWithdrawals,
        totalCoins: totalCoins[0]?.total || 0,
        blockedUsers,
        totalWithdrawals: totalWithdrawn[0]?.total || 0,
        avgSpinsPerUser,
        recentActivity: { spins: 0, withdrawals: 0 } // Placeholder
      }
    });
    
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get daily analytics (admin only)
export const getDailyStats = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    
    // Generate mock daily data for the last N days
    const dailyStats = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate some realistic mock data
      const dateStr = date.toISOString().split('T')[0];
      dailyStats.push({
        date: dateStr,
        users: Math.floor(Math.random() * 50) + 10,
        spins: Math.floor(Math.random() * 200) + 50,
        withdrawals: Math.floor(Math.random() * 10) + 1,
        revenue: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    res.json({
      data: {
        dailyStats,
        period: `${days} days`
      }
    });
    
  } catch (error) {
    logger.error('Get daily stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isBlocked, isAdmin } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked, isAdmin },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      data: {
        user
      }
    });
    
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get configuration (admin only)
export const getConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    
    const config = await (await import('../models/Config.js')).default.findOne({ key });
    
    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }
    
    res.json({
      data: {
        key: config.key,
        value: config.value,
        description: config.description,
        isPublic: config.isPublic
      }
    });
    
  } catch (error) {
    logger.error('Get config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update configuration (admin only)
export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { json } = req.body;
    
    const config = await (await import('../models/Config.js')).default.findOneAndUpdate(
      { key },
      { value: json },
      { new: true }
    );
    
    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }
    
    res.json({
      data: {
        key: config.key,
        value: config.value,
        description: config.description,
        isPublic: config.isPublic
      }
    });
    
  } catch (error) {
    logger.error('Update config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
