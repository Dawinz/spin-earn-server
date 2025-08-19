import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/index.js';
import User from '../models/User.js';
import { ApiError } from '../utils/errors.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Access token required');
    }

    const decoded = jwt.verify(token, jwtConfig.accessSecret) as any;
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    if (user.flags.blocked) {
      throw new ApiError(403, 'Account blocked');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }

    const hasRole = req.user.roles.some((role: string) => roles.includes(role));
    if (!hasRole) {
      next(new ApiError(403, 'Insufficient permissions'));
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireModerator = requireRole(['admin', 'moderator']);
