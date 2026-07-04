// routes/feedbackRoutes.js
// Defines all REST API endpoints related to feedback

const express = require('express');
const router = express.Router();

const {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
} = require('../controllers/feedbackController');

const {
  feedbackValidationRules,
  validate,
} = require('../middleware/validateFeedback');

// @route   POST /api/feedback
// @desc    Submit new feedback -> saves to DB, generates certificate, sends email
router.post('/', feedbackValidationRules, validate, submitFeedback);

// @route   GET /api/feedback
// @desc    Get all feedback submissions
router.get('/', getAllFeedback);

// @route   GET /api/feedback/:id
// @desc    Get single feedback submission by ID
router.get('/:id', getFeedbackById);

module.exports = router;
