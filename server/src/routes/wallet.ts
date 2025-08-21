import express from 'express';

const router = express.Router();

router.get('/balance', (req, res) => {
  res.json({ message: 'Wallet balance endpoint' });
});

router.get('/transactions', (req, res) => {
  res.json({ message: 'Wallet transactions endpoint' });
});

export default router;
