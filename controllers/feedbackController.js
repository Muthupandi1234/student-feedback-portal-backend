// controllers/feedbackController.js
// Handles the business logic for feedback submission, certificate
// generation, and email dispatch

const Feedback = require('../models/Feedback');
const generateCertificate = require('../utils/generateCertificate');
const sendCertificateEmail = require('../utils/sendCertificateEmail');
const crypto = require('crypto');

/**
 * Generates a unique, human-readable certificate number
 * Format: SFP-YYYY-XXXXXX (e.g., SFP-2026-4F9A2C)
 */
const generateCertificateNumber = () => {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SFP-${year}-${randomPart}`;
};

/**
 * @route   POST /api/feedback
 * @desc    Submit student feedback, generate certificate, and email it
 * @access  Public
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { name, state, email, rating } = req.body;

    // Generate a unique certificate number (retry on rare collision)
    let certificateNumber = generateCertificateNumber();
    let existing = await Feedback.findOne({ certificateNumber });
    while (existing) {
      certificateNumber = generateCertificateNumber();
      existing = await Feedback.findOne({ certificateNumber });
    }

    // 1. Save feedback to MongoDB
    const feedback = await Feedback.create({
      name,
      state,
      email,
      rating,
      certificateNumber,
    });

    // 2. Generate the PDF certificate
    const certificatePath = await generateCertificate({
      name,
      state,
      certificateNumber,
      date: feedback.createdAt,
    });

    // 3. Send the certificate via email
    let emailStatus = 'not_sent';
    try {
      await sendCertificateEmail({
        name,
        email,
        certificatePath,
        certificateNumber,
      });
      feedback.certificateSent = true;
      await feedback.save();
      emailStatus = 'sent';
    } catch (emailError) {
      // Don't fail the whole request if email fails — feedback is already
      // saved and certificate generated. Log it and inform the client.
      console.error('⚠️  Failed to send certificate email:', emailError.message);
      emailStatus = 'failed';
    }

    res.status(201).json({
      success: true,
      message:
        emailStatus === 'sent'
          ? 'Feedback submitted successfully! Your certificate has been emailed to you.'
          : 'Feedback submitted successfully, but we could not send the certificate email. Please contact support.',
      data: {
        id: feedback._id,
        name: feedback.name,
        state: feedback.state,
        email: feedback.email,
        rating: feedback.rating,
        certificateNumber: feedback.certificateNumber,
        emailStatus,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback submissions (for admin/testing purposes)
 * @access  Public (add auth middleware in production)
 */
const getAllFeedback = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/feedback/:id
 * @desc    Get a single feedback submission by ID
 * @access  Public
 */
const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found',
      });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getAllFeedback, getFeedbackById };
