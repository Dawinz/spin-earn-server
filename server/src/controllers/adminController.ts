import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService.js';
import { ValidationError } from '../utils/errors.js';

export class AdminController {
  // User Management
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string || '';

      const result = await AdminService.getUsers(page, limit, search);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const result = await AdminService.blockUser(userId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const result = await AdminService.unblockUser(userId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Withdrawal Management
  static async getWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string || 'all';

      const result = await AdminService.getWithdrawals(page, limit, status);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async approveWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const { withdrawalId } = req.params;
      const adminUserId = (req as any).user.userId;
      
      if (!withdrawalId) {
        throw new ValidationError('Withdrawal ID is required');
      }

      const result = await AdminService.approveWithdrawal(withdrawalId, adminUserId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async rejectWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const { withdrawalId } = req.params;
      const { reason } = req.body;
      const adminUserId = (req as any).user.userId;
      
      if (!withdrawalId) {
        throw new ValidationError('Withdrawal ID is required');
      }

      if (!reason) {
        throw new ValidationError('Rejection reason is required');
      }

      const result = await AdminService.rejectWithdrawal(withdrawalId, reason, adminUserId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Analytics
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDailyStats(req: Request, res: Response, next: NextFunction) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const stats = await AdminService.getDailyStats(days);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Configuration
  static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      
      if (!key) {
        throw new ValidationError('Config key is required');
      }

      const config = await AdminService.getConfig(key);
      
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const { json } = req.body;
      
      if (!key) {
        throw new ValidationError('Config key is required');
      }

      if (!json) {
        throw new ValidationError('Config data is required');
      }

      const result = await AdminService.updateConfig(key, json);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
