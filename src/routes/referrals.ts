import express from 'express';

const router = express.Router();

router.get('/code', (req, res) => {
  res.json({ message: 'Referral code endpoint' });
});

router.get('/stats', (req, res) => {
  res.json({ message: 'Referral stats endpoint' });
});

export default router;
