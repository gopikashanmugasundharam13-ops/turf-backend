const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with Debugging
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    console.log('📦 Connected to database:', mongoose.connection.db.databaseName);
    
    // List all collections in the database
    mongoose.connection.db.listCollections().toArray().then(collections => {
      console.log('📁 Collections found:', collections.map(c => c.name));
    });
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const turfRoutes = require('./routes/turf');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Turf Manager API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));