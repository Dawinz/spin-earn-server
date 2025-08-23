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
const express_1 = __importDefault(require("express"));
const adminController_js_1 = require("../controllers/adminController.js");
const auth_js_1 = require("../middleware/auth.js");
const rateLimiter_js_1 = require("../middleware/rateLimiter.js");
const router = express_1.default.Router();
router.use(auth_js_1.requireAdmin);
router.get('/users', adminController_js_1.getUsers);
router.get('/withdrawals', adminController_js_1.getWithdrawals);
router.get('/analytics', adminController_js_1.getAnalytics);
router.get('/analytics/dashboard', adminController_js_1.getAnalytics);
router.get('/analytics/daily', adminController_js_1.getDailyStats);
router.put('/users/:userId/status', adminController_js_1.updateUserStatus);
router.get('/config/:key', rateLimiter_js_1.configLimiter, adminController_js_1.getConfig);
router.put('/config/:key', rateLimiter_js_1.configLimiter, adminController_js_1.updateConfig);
router.post('/users/:userId/block', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await (await Promise.resolve().then(() => __importStar(require('../models/User.js')))).default.findByIdAndUpdate(userId, { isBlocked: true }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/users/:userId/unblock', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await (await Promise.resolve().then(() => __importStar(require('../models/User.js')))).default.findByIdAndUpdate(userId, { isBlocked: false }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map