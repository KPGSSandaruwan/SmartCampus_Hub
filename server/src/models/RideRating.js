const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Ride = require('./Ride');

const RideRating = sequelize.define('RideRating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rideId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ride_id',
    references: {
      model: Ride,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'user_id'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'ride_ratings',
  timestamps: true,
  underscored: true
});

// Relationships
Ride.hasOne(RideRating, { foreignKey: 'ride_id', as: 'rating' });
RideRating.belongsTo(Ride, { foreignKey: 'ride_id', as: 'rideDetails' });

module.exports = RideRating;
