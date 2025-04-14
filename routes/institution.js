const express = require('express');
const Institution = require('../models/Institution');
const router = express.Router();

router.post('/institution', async (req, res) => {
  const { instituteName, idNumber, year, branch } = req.body;
  try {
    const institution = new Institution({ instituteName, idNumber, year, branch });
    await institution.save();
    res.status(201).json({ message: 'Institution data saved successfully', institution });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get institution data
router.get('/institution', async (req, res) => {
  try {
    const institution = await Institution.findOne().sort({ _id: -1 }); // Get the latest entry
    if (!institution) {
      return res.status(404).json({ message: 'No institution data found' });
    }
    res.json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;