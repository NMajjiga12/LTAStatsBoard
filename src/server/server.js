const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api/runners', require('./routes/runners'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from React build if it exists
app.use(express.static(path.join(__dirname, '../../build')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`=== Time Attack Dashboard ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - API: http://localhost:${PORT}/api/runners`);
  console.log(`  - Health: http://localhost:${PORT}/api/health`);
  console.log(`  - OBS Runner: http://localhost:${PORT}/obs/:username`);
  console.log(`  - OBS Leaderboard: http://localhost:${PORT}/obs_leaderboard`);
  console.log(`\nPress Ctrl+C to stop the server`);
});