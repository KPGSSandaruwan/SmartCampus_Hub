const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

// Register all models for Sequelize sync
require('./models/User');
require('./models/Listing');
require('./models/Order');
require('./models/RentalCategory');
require('./models/Rider');
require('./models/Ride');
require('./models/RideRequest');
require('./models/RideRating');
require('./models/Parcel');
require('./models/ParcelAssignment');
require('./models/RentalItem');
require('./models/RentalBooking');
require('./models/Job');
require('./models/JobApplication');

// Sync Sequelize Models with MySQL
sequelize.sync({ alter: true })
  .then(() => console.log('Sequelize Models Synced with MySQL'))
  .catch(err => console.error('Failed to sync Sequelize models:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/orders', require('./routes/orders'));

app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/parcels', require('./routes/parcels'));
app.use('/api/jobs', require('./routes/jobs'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'UniConnect Backend API', timestamp: new Date() });
});

// Root API Endpoint
app.get('/', (req, res) => {
  res.send('UniConnect API is running smoothly.');
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 UniConnect Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} (local database mode)`);
});

module.exports = app;
