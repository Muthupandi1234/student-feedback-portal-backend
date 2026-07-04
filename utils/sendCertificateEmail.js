// utils/sendCertificateEmail.js
// Sends the generated certificate PDF to the student's email using Nodemailer

const transporter = require('../config/mailer');
const path = require('path');

/**
 * Sends an email with the certificate PDF attached.
 * @param {Object} data
 * @param {string} data.name - Student's name
 * @param {string} data.email - Recipient email
 * @param {string} data.certificatePath - Absolute path to the PDF file
 * @param {string} data.certificateNumber - Certificate number for reference
 */
const sendCertificateEmail = async ({ name, email, certificatePath, certificateNumber }) => {
  const orgName = process.env.ORG_NAME || 'Student Feedback Portal';

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Participation Certificate - Student Feedback Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #1a3c6e;">Thank You, ${name}! 🎉</h2>
        <p>
          Thank you for attending our event and taking the time to submit your valuable feedback.
          We truly appreciate your participation and input.
        </p>
        <p>
          Please find attached your official <strong>Participation Certificate</strong>
          (Certificate No: <strong>${certificateNumber}</strong>) as a token of appreciation.
        </p>
        <p>
          We hope to see you at our future events!
        </p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>${orgName} Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Certificate_${certificateNumber}.pdf`,
        path: certificatePath,
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendCertificateEmail;
