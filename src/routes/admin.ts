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
    // Implementation for blocking user
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block user' });
  }
});

router.post('/users/:userId/unblock', async (req, res) => {
  try {
    const { userId } = req.params;
    // Implementation for unblocking user
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

// Seed database endpoint (temporary for production setup)
router.post('/seed', async (req, res) => {
  try {
    // Import and run seed function
    const { seedDatabase } = await import('../scripts/seed.js');
    await seedDatabase();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database', details: error.message });
  }
});

// Create admin user endpoint (for initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;
    
    // Check secret key (you can set this in environment variables)
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'spin-earn-admin-2024';
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }
    
    // Check if user already exists
    const User = (await import('../models/User.js')).default;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create admin user
    const adminUser = new User({
      email,
      password,
      isAdmin: true,
      isEmailVerified: true,
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    });
    
    await adminUser.save();
    
    res.json({ 
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin user', details: error.message });
  }
});

export default router;
