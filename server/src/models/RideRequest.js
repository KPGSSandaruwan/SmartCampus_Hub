const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Ride = require('./Ride');

const RideRequest = sequelize.define('RideRequest', {
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
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'ride_requests',
  timestamps: true,
  underscored: true
});

// Relationships
Ride.hasMany(RideRequest, { foreignKey: 'ride_id', as: 'requests' });
RideRequest.belongsTo(Ride, { foreignKey: 'ride_id', as: 'rideDetails' });

module.exports = RideRequest;
