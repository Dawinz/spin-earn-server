import express from 'express';

const router = express.Router();

router.post('/ssv', (req, res) => {
  res.json({ message: 'AdMob SSV endpoint' });
});

export default router;
