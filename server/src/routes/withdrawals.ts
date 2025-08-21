import express from 'express';

const router = express.Router();

router.post('/request', (req, res) => {
  res.json({ message: 'Withdrawal request endpoint' });
});

router.get('/history', (req, res) => {
  res.json({ message: 'Withdrawal history endpoint' });
});

export default router;
