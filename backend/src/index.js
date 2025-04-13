const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { startAgenda } = require('./agenda');
const emailRoutes = require('./routes/email');
const sequenceRoutes = require('./routes/sequence');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email-sequence', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/sequence', sequenceRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Email Marketing Sequence API' });
});

// Start Agenda
startAgenda().catch((err) => {
  console.error('Failed to start Agenda:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 