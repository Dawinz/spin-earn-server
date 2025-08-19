import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from '../models/User.js';
import Device from '../models/Device.js';
import { jwtConfig } from '../config/index.js';
import { ApiError, ValidationError, UnauthorizedError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export interface RegisterData {
  email: string;
  password: string;
  deviceInfo: {
    fingerprintHash: string;
    model: string;
    os: string;
    emulator: boolean;
    rooted: boolean;
    ipAddress: string;
  };
  referralCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
  deviceInfo: {
    fingerprintHash: string;
    model: string;
    os: string;
    emulator: boolean;
    rooted: boolean;
    ipAddress: string;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
}

export class AuthService {
  static async register(data: RegisterData): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const { email, password, deviceInfo, referralCode } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      passwordHash,
      referralCode: referralCode?.toUpperCase()
    });

    await user.save();

    // Register device
    await this.registerDevice((user._id as any).toString(), deviceInfo);

    // Set as primary device if first device
    if (!user.devicePrimaryId) {
      user.devicePrimaryId = deviceInfo.fingerprintHash;
      await user.save();
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    logger.info('User registered successfully', { userId: user._id, email: user.email });

    return { user, accessToken, refreshToken };
  }

  static async login(data: LoginData): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const { email, password, deviceInfo } = data;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if account is blocked
    if (user.flags.blocked) {
      throw new UnauthorizedError('Account is blocked');
    }

    // Register or update device
    await this.registerDevice((user._id as any).toString(), deviceInfo);

    // Set as primary device if none exists
    if (!user.devicePrimaryId) {
      user.devicePrimaryId = deviceInfo.fingerprintHash;
      await user.save();
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    logger.info('User logged in successfully', { userId: user._id, email: user.email });

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret) as TokenPayload;
      const user = await User.findById(decoded.userId);

      if (!user || user.flags.blocked) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  static async registerDevice(userId: string, deviceInfo: any): Promise<void> {
    const { fingerprintHash, model, os, emulator, rooted, ipAddress } = deviceInfo;

    // Check if device already registered for this user
    const existingDevice = await Device.findOne({
      userId,
      fingerprintHash
    });

    if (existingDevice) {
      // Update last IP
      existingDevice.lastIP = ipAddress;
      await existingDevice.save();
    } else {
      // Register new device
      const device = new Device({
        userId,
        fingerprintHash,
        model,
        os,
        emulator,
        rooted,
        lastIP: ipAddress
      });
      await device.save();
    }
  }

  static generateAccessToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      roles: user.roles
    };

    return jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessTtl
    } as any);
  }

  static generateRefreshToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      roles: user.roles
    };

    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshTtl
    } as any);
  }

  static generateMagicLinkToken(email: string): string {
    const payload = { email, type: 'magic_link' };
    return jwt.sign(payload, jwtConfig.accessSecret, { expiresIn: '15m' });
  }

  static verifyMagicLinkToken(token: string): { email: string; type: string } {
    try {
      return jwt.verify(token, jwtConfig.accessSecret) as { email: string; type: string };
    } catch (error) {
      throw new UnauthorizedError('Invalid magic link token');
    }
  }
}
