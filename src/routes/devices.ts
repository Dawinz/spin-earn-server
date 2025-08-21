import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Device registration endpoint' });
});

export default router;
