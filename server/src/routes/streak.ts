import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({ message: 'Streak status endpoint' });
});

router.post('/claim', (req, res) => {
  res.json({ message: 'Streak claim endpoint' });
});

export default router;
