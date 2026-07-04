// routes/statesRoutes.js
// Provides the list of Indian States & Union Territories to the frontend

const express = require('express');
const router = express.Router();
const { INDIAN_STATES } = require('../middleware/validateFeedback');

// @route   GET /api/states
// @desc    Get list of all Indian states and union territories
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: INDIAN_STATES });
});

module.exports = router;
