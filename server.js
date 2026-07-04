// server.js
// Entry point for the Student Feedback Portal backend server

require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // ADD THIS LINE

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const feedbackRoutes = require('./routes/feedbackRoutes');
const statesRoutes = require('./routes/statesRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // request logging in development
}

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 Student Feedback Portal API is running',
  });
});

app.use('/api/feedback', feedbackRoutes);
app.use('/api/states', statesRoutes);

// Serve generated certificates statically (optional, useful for debugging)
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
