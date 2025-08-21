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

export default router;
