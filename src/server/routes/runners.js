const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../../../runner_data.json');

// Helper functions
const loadRunnerData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return default data structure
    return Array(7).fill().map((_, i) => ({
      id: i + 1,
      name: "",
      therunUsername: "",
      time: "",
      validTime: false
    }));
  }
};

const saveRunnerData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

const timeStringToMs = (timeString) => {
  if (!timeString) return Infinity;
  
  try {
    const pattern = /^(\d{1,2}):([0-5]\d):([0-5]\d)\.(\d{3})$/;
    const match = timeString.match(pattern);
    
    if (!match) return Infinity;
    
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseInt(match[3]);
    const milliseconds = parseInt(match[4]);
    
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + milliseconds;
  } catch {
    return Infinity;
  }
};

// Routes
router.get('/', async (req, res) => {
  try {
    const data = await loadRunnerData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load runner data' });
  }
});

router.post('/', async (req, res) => {
  try {
    await saveRunnerData(req.body);
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save runner data' });
  }
});

router.get('/leaderboard_data', async (req, res) => {
  try {
    const data = await loadRunnerData();
    
    // Filter and sort runners
    const validRunners = data.filter(r => r.validTime && r.name);
    const invalidRunners = data.filter(r => !r.validTime && r.name);
    
    // Sort valid runners by time
    validRunners.sort((a, b) => timeStringToMs(a.time) - timeStringToMs(b.time));
    
    // Combine valid and invalid runners
    const leaderboardData = [...validRunners, ...invalidRunners];
    
    res.json(leaderboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard data' });
  }
});

module.exports = router;