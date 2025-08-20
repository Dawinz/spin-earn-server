import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = Router();

// Apply auth and admin middleware to all admin routes
router.use(authenticateToken);
router.use(adminMiddleware);

// User Management
router.get('/users', AdminController.getUsers);
router.post('/users/:userId/block', AdminController.blockUser);
router.post('/users/:userId/unblock', AdminController.unblockUser);

// Withdrawal Management
router.get('/withdrawals', AdminController.getWithdrawals);
router.post('/withdrawals/:withdrawalId/approve', AdminController.approveWithdrawal);
router.post('/withdrawals/:withdrawalId/reject', AdminController.rejectWithdrawal);

// Analytics
router.get('/analytics/dashboard', AdminController.getDashboardStats);
router.get('/analytics/daily', AdminController.getDailyStats);

// Configuration
router.get('/config/:key', AdminController.getConfig);
router.put('/config/:key', AdminController.updateConfig);

export default router;
