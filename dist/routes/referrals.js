"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/code', (req, res) => {
    res.json({ message: 'Referral code endpoint' });
});
router.get('/stats', (req, res) => {
    res.json({ message: 'Referral stats endpoint' });
});
exports.default = router;
//# sourceMappingURL=referrals.js.map