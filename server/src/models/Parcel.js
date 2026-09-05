const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Parcel = sequelize.define('Parcel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'sender_id'
  },
  pickupLocation: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'pickup_location'
  },
  dropLocation: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'drop_location'
  },
  weightKg: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'weight_kg'
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trackingCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tracking_code'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending'
  },
  pickedUpAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'picked_up_at'
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'delivered_at'
  }
}, {
  tableName: 'parcels',
  timestamps: true,
  underscored: true
});

module.exports = Parcel;
