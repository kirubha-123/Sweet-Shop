const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('MONGODB_URI from env:', process.env.MONGODB_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Sweet Shop API running!' });
});

const PORT = process.env.PORT || 3000;

// Export app for testing AND listen for normal use
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
