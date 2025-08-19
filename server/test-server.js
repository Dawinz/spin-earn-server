// Simple test script to verify server functionality
const express = require('express');
const app = express();

// Basic health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Spin & Earn API is running'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working correctly',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/healthz`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});
