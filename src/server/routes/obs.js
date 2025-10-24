const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Serve OBS runner stats page
router.get('/:username', (req, res) => {
  const username = req.params.username;
  const obsRunnerPath = path.join(__dirname, '../../../public/obs_runner.html');
  
  fs.readFile(obsRunnerPath, 'utf8')
    .then(html => {
      const renderedHtml = html.replace(/{{ username }}/g, username);
      res.send(renderedHtml);
    })
    .catch(error => {
      res.status(500).send('Error loading OBS runner page');
    });
});

// Serve OBS leaderboard page
router.get('/', (req, res) => {
  const obsLeaderboardPath = path.join(__dirname, '../../../public/obs_leaderboard.html');
  res.sendFile(obsLeaderboardPath);
});

module.exports = router;