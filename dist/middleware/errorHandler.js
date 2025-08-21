"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const index_js_1 = __importDefault(require("../config/index.js"));
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    logger_js_1.default.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });
    res.status(statusCode).json({
        error: err.message,
        stack: index_js_1.default.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map