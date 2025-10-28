const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../../../commentator_data.json');

// Helper functions
const loadCommentatorData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    
    // Migrate from old pfpLink format to new discordId format if needed
    const migratedData = parsedData.map(commentator => {
      // If we have pfpLink but no discordId, try to extract Discord ID
      if (commentator.pfpLink && !commentator.discordId) {
        const discordIdMatch = commentator.pfpLink.match(/basic\/(\d+)/);
        if (discordIdMatch && discordIdMatch[1]) {
          commentator.discordId = discordIdMatch[1];
        }
        // Remove the old pfpLink field
        delete commentator.pfpLink;
      }
      return commentator;
    });
    
    return migratedData;
  } catch (error) {
    // Return default data structure
    return Array(3).fill().map((_, i) => ({
      id: i + 1,
      name: "",
      handle: "",
      discordId: "",
      enabled: false
    }));
  }
};

const saveCommentatorData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// Routes
router.get('/', async (req, res) => {
  try {
    const data = await loadCommentatorData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load commentator data' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    await saveCommentatorData(data);
    res.json({ status: 'success', message: 'Commentator data saved' });
  } catch (error) {
    console.error('Failed to save commentator data:', error);
    res.status(500).json({ error: 'Failed to save commentator data' });
  }
});

module.exports = router;