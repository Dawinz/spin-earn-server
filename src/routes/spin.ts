import express from 'express';

const router = express.Router();

// GET endpoint for spin info
router.get('/', (req, res) => {
  res.json({ 
    message: 'Spin endpoint',
    availableActions: ['POST /spin', 'GET /history'],
    description: 'Spin wheel game endpoint'
  });
});

router.post('/spin', (req, res) => {
  res.json({ message: 'Spin endpoint' });
});

router.get('/history', (req, res) => {
  res.json({ message: 'Spin history endpoint' });
});

export default router;
