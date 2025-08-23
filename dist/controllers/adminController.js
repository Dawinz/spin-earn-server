"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = exports.getConfig = exports.updateUserStatus = exports.getDailyStats = exports.getAnalytics = exports.getWithdrawals = exports.getUsers = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const WithdrawalRequest_js_1 = __importDefault(require("../models/WithdrawalRequest.js"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const getUsers = async (req, res) => {
    try {
        const users = await User_js_1.default.find({}).select('-password').sort({ createdAt: -1 });
        const transformedUsers = users.map(user => ({
            id: user._id,
            email: user.email,
            joinDate: user.createdAt,
            coins: user.currentBalance,
            streak: user.streakDays,
            status: user.isBlocked ? 'blocked' : 'active'
        }));
        res.json({
            data: {
                users: transformedUsers,
                total: users.length
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
const getWithdrawals = async (req, res) => {
    try {
        const withdrawals = await WithdrawalRequest_js_1.default.find({})
            .populate('userId', 'email currentBalance')
            .sort({ createdAt: -1 });
        const transformedWithdrawals = withdrawals.map(withdrawal => {
            const populatedUser = withdrawal.userId;
            return {
                id: withdrawal._id,
                userId: populatedUser._id || populatedUser,
                userEmail: populatedUser.email || 'Unknown',
                amount: withdrawal.amount,
                status: withdrawal.status,
                requestDate: withdrawal.createdAt,
                method: withdrawal.method,
                accountInfo: withdrawal.accountInfo
            };
        });
        res.json({
            data: {
                withdrawals: transformedWithdrawals,
                total: withdrawals.length
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Get withdrawals error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getWithdrawals = getWithdrawals;
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User_js_1.default.countDocuments({});
        const totalEarnings = await User_js_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
        ]);
        const totalWithdrawn = await User_js_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$totalWithdrawn' } } }
        ]);
        const totalCoins = await User_js_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$currentBalance' } } }
        ]);
        const blockedUsers = await User_js_1.default.countDocuments({ isBlocked: true });
        const pendingWithdrawals = await WithdrawalRequest_js_1.default.countDocuments({ status: 'pending' });
        const totalSpins = await User_js_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$dailySpinCount' } } }
        ]);
        const activeUsers = await User_js_1.default.countDocuments({
            lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        const avgSpinsPerUser = totalUsers > 0 ? Math.round((totalSpins[0]?.total || 0) / totalUsers) : 0;
        res.json({
            data: {
                totalUsers,
                totalSpins: totalSpins[0]?.total || 0,
                activeUsers,
                pendingWithdrawals,
                totalCoins: totalCoins[0]?.total || 0,
                blockedUsers,
                totalWithdrawals: totalWithdrawn[0]?.total || 0,
                avgSpinsPerUser,
                recentActivity: { spins: 0, withdrawals: 0 }
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Get analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAnalytics = getAnalytics;
const getDailyStats = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const dailyStats = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyStats.push({
                date: dateStr,
                users: Math.floor(Math.random() * 50) + 10,
                spins: Math.floor(Math.random() * 200) + 50,
                withdrawals: Math.floor(Math.random() * 10) + 1,
                revenue: Math.floor(Math.random() * 1000) + 100
            });
        }
        res.json({
            data: {
                dailyStats,
                period: `${days} days`
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Get daily stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getDailyStats = getDailyStats;
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBlocked, isAdmin } = req.body;
        const user = await User_js_1.default.findByIdAndUpdate(userId, { isBlocked, isAdmin }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            message: 'User updated successfully',
            data: {
                user
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Update user status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateUserStatus = updateUserStatus;
const getConfig = async (req, res) => {
    try {
        const { key } = req.params;
        const config = await (await Promise.resolve().then(() => __importStar(require('../models/Config.js')))).default.findOne({ key });
        if (!config) {
            return res.status(404).json({ error: 'Configuration not found' });
        }
        res.json({
            data: {
                key: config.key,
                value: config.value,
                description: config.description,
                isPublic: config.isPublic
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Get config error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getConfig = getConfig;
const updateConfig = async (req, res) => {
    try {
        const { key } = req.params;
        const { json } = req.body;
        const config = await (await Promise.resolve().then(() => __importStar(require('../models/Config.js')))).default.findOneAndUpdate({ key }, { value: json }, { new: true });
        if (!config) {
            return res.status(404).json({ error: 'Configuration not found' });
        }
        res.json({
            data: {
                key: config.key,
                value: config.value,
                description: config.description,
                isPublic: config.isPublic
            }
        });
    }
    catch (error) {
        logger_js_1.default.error('Update config error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateConfig = updateConfig;
//# sourceMappingURL=adminController.js.map