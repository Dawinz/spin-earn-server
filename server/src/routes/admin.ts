import express from 'express';
import { getUsers, getWithdrawals, getAnalytics, updateUserStatus, getDailyStats, getConfig, updateConfig } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';
import { configLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/withdrawals', getWithdrawals);
router.get('/analytics', getAnalytics);
router.get('/analytics/dashboard', getAnalytics); // Alias for dashboard
router.get('/analytics/daily', getDailyStats); // Daily analytics
router.put('/users/:userId/status', updateUserStatus);

// Configuration routes with lenient rate limiting
router.get('/config/:key', configLimiter, getConfig);
router.put('/config/:key', configLimiter, updateConfig);

// Add missing endpoints that frontend expects
router.post('/users/:userId/block', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await (await import('../models/User.js')).default.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/users/:userId/unblock', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await (await import('../models/User.js')).default.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Special endpoint to create admin users (requires secret key)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;
    
    // Verify secret key (this should be in environment variables)
    if (secretKey !== 'spin-earn-admin-2024') {
      return res.status(403).json({ error: 'Invalid secret key' });
    }
    
    // Check if user already exists
    const existingUser = await (await import('../models/User.js')).default.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Generate unique referral code
    const { v4: uuidv4 } = await import('uuid');
    const userReferralCode = uuidv4().substring(0, 8).toUpperCase();
    
    // Create admin user
    const user = new (await import('../models/User.js')).default({
      email,
      password,
      referralCode: userReferralCode,
      isAdmin: true,
      isEmailVerified: true,
      currentBalance: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      dailySpinCount: 0,
      streakDays: 0
    });
    
    await user.save();
    
    // Generate tokens
    const jwt = await import('jsonwebtoken');
    const config = await import('../config/index.js');
    
    const accessToken = jwt.sign(
      { userId: user._id.toString(), type: 'access' },
      config.default.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id.toString(), type: 'refresh' },
      config.default.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      currentBalance: user.currentBalance,
      streakDays: user.streakDays,
      referralCode: user.referralCode
    };
    
    res.status(201).json({
      message: 'Admin user created successfully',
      data: {
        user: userData,
        accessToken,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
