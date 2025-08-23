import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    config.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, referralCode, isAdmin, secretKey } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Check admin creation with secret key
    if (isAdmin) {
      const ADMIN_SECRET = process.env.ADMIN_SECRET || 'spin-earn-admin-2024';
      if (secretKey !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Invalid secret key for admin creation' });
      }
    }
    
    // Generate unique referral code
    const userReferralCode = uuidv4().substring(0, 8).toUpperCase();
    
    // Check if referred by someone
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }
    
    // Create user
    const user = new User({
      email,
      password,
      referralCode: userReferralCode,
      referredBy,
      isEmailVerified: true, // For now, skip email verification
      isAdmin: isAdmin || false
    });
    
    await user.save();
    
    // Generate tokens
    const tokens = generateTokens(user._id.toString());
    
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
      message: 'User registered successfully',
      data: {
        user: userData,
        ...tokens
      }
    });
    
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Account is blocked' });
    }
    
    // Check if user is shadow banned
    if (user.isShadowBanned) {
      return res.status(403).json({ error: 'Account is suspended' });
    }
    
    // Verify password
    if (user.password) {
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();
    
    // Generate tokens
    const tokens = generateTokens(user._id.toString());
    
    // Return user data
    const userData = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      currentBalance: user.currentBalance,
      streakDays: user.streakDays,
      referralCode: user.referralCode
    };
    
    res.json({
      message: 'Login successful',
      data: {
        user: userData,
        ...tokens
      }
    });
    
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - userId is set by auth middleware
    const userId = req.userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          isEmailVerified: user.isEmailVerified,
          currentBalance: user.currentBalance,
          totalEarnings: user.totalEarnings,
          totalWithdrawn: user.totalWithdrawn,
          dailySpinCount: user.dailySpinCount,
          streakDays: user.streakDays,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as any;
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Generate new tokens
    const tokens = generateTokens(user._id.toString());
    
    res.json({
      message: 'Token refreshed successfully',
      data: {
        ...tokens
      }
    });
    
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    // In a real implementation, you might want to blacklist the refresh token
    // For now, just return success
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
