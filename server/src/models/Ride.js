const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Rider = require('./Rider');

const Ride = sequelize.define('Ride', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  riderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'rider_id',
    references: {
      model: Rider,
      key: 'id'
    }
  },
  startLocation: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'start_location'
  },
  endLocation: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'end_location'
  },
  distanceKm: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'distance_km'
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'rides',
  timestamps: true,
  underscored: true
});

// Relationships
Rider.hasMany(Ride, { foreignKey: 'rider_id' });
Ride.belongsTo(Rider, { foreignKey: 'rider_id', as: 'riderDetails' });

module.exports = Ride;
