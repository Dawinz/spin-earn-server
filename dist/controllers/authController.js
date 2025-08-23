"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const User_js_1 = __importDefault(require("../models/User.js"));
const index_js_1 = __importDefault(require("../config/index.js"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, type: 'access' }, index_js_1.default.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, type: 'refresh' }, index_js_1.default.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
const register = async (req, res) => {
    try {
        const { email, password, referralCode } = req.body;
        const existingUser = await User_js_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const userReferralCode = (0, uuid_1.v4)().substring(0, 8).toUpperCase();
        let referredBy = null;
        if (referralCode) {
            const referrer = await User_js_1.default.findOne({ referralCode });
            if (referrer) {
                referredBy = referrer._id;
            }
        }
        const user = new User_js_1.default({
            email,
            password,
            referralCode: userReferralCode,
            referredBy,
            isEmailVerified: true
        });
        await user.save();
        const tokens = generateTokens(user._id.toString());
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
    }
    catch (error) {
        logger_js_1.default.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_js_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ error: 'Account is blocked' });
        }
        if (user.isShadowBanned) {
            return res.status(403).json({ error: 'Account is suspended' });
        }
        if (user.password) {
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        }
        user.lastLoginAt = new Date();
        user.lastLoginIp = req.ip;
        await user.save();
        const tokens = generateTokens(user._id.toString());
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
    }
    catch (error) {
        logger_js_1.default.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_js_1.default.findById(userId).select('-password');
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
    }
    catch (error) {
        logger_js_1.default.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, index_js_1.default.JWT_REFRESH_SECRET);
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token type' });
        }
        const user = await User_js_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const tokens = generateTokens(user._id.toString());
        res.json({
            message: 'Token refreshed successfully',
            data: {
                ...tokens
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Refresh token error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        logger_js_1.default.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map