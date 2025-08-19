import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '../config/index.js';

export const apiLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const spinLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 spin attempts per minute
  message: {
    success: false,
    error: {
      message: 'Too many spin attempts, please slow down.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});
