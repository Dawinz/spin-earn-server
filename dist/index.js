"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const database_js_1 = __importDefault(require("./config/database.js"));
const index_js_1 = __importDefault(require("./config/index.js"));
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const logger_js_1 = __importDefault(require("./utils/logger.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const spin_js_1 = __importDefault(require("./routes/spin.js"));
const ads_js_1 = __importDefault(require("./routes/ads.js"));
const devices_js_1 = __importDefault(require("./routes/devices.js"));
const wallet_js_1 = __importDefault(require("./routes/wallet.js"));
const withdrawals_js_1 = __importDefault(require("./routes/withdrawals.js"));
const streak_js_1 = __importDefault(require("./routes/streak.js"));
const referrals_js_1 = __importDefault(require("./routes/referrals.js"));
const admin_js_1 = __importDefault(require("./routes/admin.js"));
const app = (0, express_1.default)();
(0, database_js_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', rateLimiter_js_1.apiLimiter);
app.get('/', (req, res) => {
    res.json({
        name: 'Spin & Earn API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/healthz',
            auth: '/api/v1/auth',
            spin: '/api/v1/spin',
            ads: '/api/v1/ads',
            devices: '/api/v1/devices',
            wallet: '/api/v1/wallet',
            withdrawals: '/api/v1/withdrawals',
            streak: '/api/v1/streak',
            referrals: '/api/v1/referrals',
            admin: '/api/v1/admin'
        }
    });
});
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/v1/auth', auth_js_1.default);
app.use('/api/v1/spin', spin_js_1.default);
app.use('/api/v1/ads', ads_js_1.default);
app.use('/api/v1/devices', devices_js_1.default);
app.use('/api/v1/wallet', wallet_js_1.default);
app.use('/api/v1/withdrawals', withdrawals_js_1.default);
app.use('/api/v1/streak', streak_js_1.default);
app.use('/api/v1/referrals', referrals_js_1.default);
app.use('/api/v1/admin', admin_js_1.default);
app.use(errorHandler_js_1.notFoundHandler);
app.use(errorHandler_js_1.errorHandler);
const PORT = index_js_1.default.PORT;
app.listen(PORT, () => {
    logger_js_1.default.info(`Server running on port ${PORT} in ${index_js_1.default.NODE_ENV} mode`);
});
process.on('SIGTERM', () => {
    logger_js_1.default.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_js_1.default.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map