// utils/generateCertificate.js
// Generates a professional PDF participation certificate using PDFKit

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a certificate PDF and saves it to disk.
 * @param {Object} data - Certificate data
 * @param {string} data.name - Student's full name
 * @param {string} data.state - Student's state
 * @param {string} data.certificateNumber - Unique certificate number
 * @param {Date} data.date - Date of issue
 * @returns {Promise<string>} - Resolves with the absolute file path of the generated PDF
 */
const generateCertificate = ({ name, state, certificateNumber, date }) => {
  return new Promise((resolve, reject) => {
    try {
      const certDir = path.join(__dirname, '..', 'certificates');
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
      }

      const fileName = `certificate_${certificateNumber}.pdf`;
      const filePath = path.join(certDir, fileName);

      // Landscape A4 certificate
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth = doc.page.width; // ~842
      const pageHeight = doc.page.height; // ~595

      const orgName = process.env.ORG_NAME || 'Student Feedback Portal';
      const signatory = process.env.ORG_SIGNATORY || 'Program Coordinator';
      const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      // ---- Background ----
      doc.rect(0, 0, pageWidth, pageHeight).fill('#FFFFFF');

      // ---- Outer decorative border ----
      doc
        .lineWidth(6)
        .strokeColor('#1a3c6e')
        .rect(20, 20, pageWidth - 40, pageHeight - 40)
        .stroke();

      doc
        .lineWidth(1.5)
        .strokeColor('#c9a227')
        .rect(32, 32, pageWidth - 64, pageHeight - 64)
        .stroke();

      // ---- Header: Organization Name ----
      doc
        .font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('#1a3c6e')
        .text(orgName.toUpperCase(), 0, 70, {
          align: 'center',
          width: pageWidth,
        });

      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#555555')
        .text('Certificate of Participation', 0, 108, {
          align: 'center',
          width: pageWidth,
        });

      // ---- Decorative line ----
      doc
        .moveTo(pageWidth / 2 - 80, 132)
        .lineTo(pageWidth / 2 + 80, 132)
        .lineWidth(2)
        .strokeColor('#c9a227')
        .stroke();

      // ---- Main Title ----
      doc
        .font('Helvetica-Bold')
        .fontSize(40)
        .fillColor('#0d1b2a')
        .text('CERTIFICATE', 0, 155, { align: 'center', width: pageWidth });

      doc
        .font('Helvetica')
        .fontSize(16)
        .fillColor('#333333')
        .text('This certificate is proudly presented to', 0, 210, {
          align: 'center',
          width: pageWidth,
        });

      // ---- Student Name ----
      doc
        .font('Helvetica-Bold')
        .fontSize(34)
        .fillColor('#1a3c6e')
        .text(name, 0, 245, { align: 'center', width: pageWidth });

      // Underline beneath name
      const nameWidth = doc.widthOfString(name, { font: 'Helvetica-Bold', size: 34 });
      doc
        .moveTo(pageWidth / 2 - nameWidth / 2 - 10, 290)
        .lineTo(pageWidth / 2 + nameWidth / 2 + 10, 290)
        .lineWidth(1)
        .strokeColor('#c9a227')
        .stroke();

      // ---- Body text ----
      doc
        .font('Helvetica')
        .fontSize(14)
        .fillColor('#333333')
        .text(
          `from ${state}, for actively participating in the event and successfully submitting valuable feedback.`,
          80,
          310,
          { align: 'center', width: pageWidth - 160 }
        );

      // ---- Footer Section: Date | Certificate No | Signature ----
      const footerY = pageHeight - 130;

      // Date (left)
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#1a3c6e')
        .text('Date of Issue', 90, footerY, { width: 200, align: 'left' });
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#333333')
        .text(formattedDate, 90, footerY + 18, { width: 200, align: 'left' });
      doc
        .moveTo(90, footerY + 40)
        .lineTo(250, footerY + 40)
        .strokeColor('#999999')
        .lineWidth(0.8)
        .stroke();

      // Certificate Number (center)
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#1a3c6e')
        .text('Certificate No.', pageWidth / 2 - 100, footerY, {
          width: 200,
          align: 'center',
        });
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#333333')
        .text(certificateNumber, pageWidth / 2 - 100, footerY + 18, {
          width: 200,
          align: 'center',
        });
      doc
        .moveTo(pageWidth / 2 - 80, footerY + 40)
        .lineTo(pageWidth / 2 + 80, footerY + 40)
        .strokeColor('#999999')
        .lineWidth(0.8)
        .stroke();

      // Digital Signature Placeholder (right)
      doc
        .font('Helvetica-Oblique')
        .fontSize(16)
        .fillColor('#1a3c6e')
        .text(signatory, pageWidth - 290, footerY - 10, {
          width: 200,
          align: 'center',
        });
      doc
        .moveTo(pageWidth - 290, footerY + 18)
        .lineTo(pageWidth - 90, footerY + 18)
        .strokeColor('#999999')
        .lineWidth(0.8)
        .stroke();
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#1a3c6e')
        .text('Authorized Signatory', pageWidth - 290, footerY + 24, {
          width: 200,
          align: 'center',
        });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;
