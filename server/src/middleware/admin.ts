import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors.js';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!user.roles || !user.roles.includes('admin')) {
      throw new UnauthorizedError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
