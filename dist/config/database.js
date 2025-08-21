"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_js_1 = __importDefault(require("./index.js"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(index_js_1.default.MONGODB_URI);
        logger_js_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            logger_js_1.default.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        logger_js_1.default.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map