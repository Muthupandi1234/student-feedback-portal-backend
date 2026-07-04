// config/mailer.js
// Configures and exports the Nodemailer transporter

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for port 465, false for other ports (like 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration on startup (non-blocking)
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️  Email transporter not ready:', error.message);
    console.warn('   Check EMAIL_USER / EMAIL_PASS in your .env file.');
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

module.exports = transporter;
