import express from 'express';

const router = express.Router();

// GET endpoint for ads info
router.get('/', (req, res) => {
  res.json({ 
    message: 'Ads endpoint',
    availableActions: ['POST /ssv'],
    description: 'AdMob and advertising endpoints'
  });
});

router.post('/ssv', (req, res) => {
  res.json({ message: 'AdMob SSV endpoint' });
});

export default router;
