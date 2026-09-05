const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Rider = sequelize.define('Rider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'user_id'
  },
  bikeNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'bike_number'
  },
  bikeModel: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'bike_model'
  },
  licenseNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'license_number'
  }
}, {
  tableName: 'riders',
  timestamps: true,
  underscored: true
});

module.exports = Rider;
