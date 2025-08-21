"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/status', (req, res) => {
    res.json({ message: 'Streak status endpoint' });
});
router.post('/claim', (req, res) => {
    res.json({ message: 'Streak claim endpoint' });
});
exports.default = router;
//# sourceMappingURL=streak.js.map