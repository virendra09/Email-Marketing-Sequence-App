const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { agenda } = require('../agenda');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Schedule email endpoint
router.post('/schedule', async (req, res) => {
  try {
    const { to, subject, text, scheduleTime } = req.body;

    // Validate required fields
    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate delay in milliseconds
    const delay = scheduleTime ? new Date(scheduleTime).getTime() - Date.now() : 3600000; // Default 1 hour

    // Schedule the email
    await agenda.schedule(new Date(Date.now() + delay), 'send email', {
      to,
      subject,
      text,
    });

    res.json({ message: 'Email scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling email:', error);
    res.status(500).json({ error: 'Failed to schedule email' });
  }
});

// Email sending job definition
agenda.define('send email', async (job) => {
  const { to, subject, text } = job.attrs.data;

  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
});

module.exports = router; 