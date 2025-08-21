import express from 'express';

const router = express.Router();

router.post('/spin', (req, res) => {
  res.json({ message: 'Spin endpoint' });
});

router.get('/history', (req, res) => {
  res.json({ message: 'Spin history endpoint' });
});

export default router;
