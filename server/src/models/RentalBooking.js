const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RentalBooking = sequelize.define('RentalBooking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  itemId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'item_id'
  },
  itemTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'item_title'
  },
  itemImage: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'item_image'
  },
  itemDailyPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'item_daily_price'
  },
  itemDeposit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'item_deposit'
  },
  requesterId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'requester_id'
  },
  requesterName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'requester_name'
  },
  requesterEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'requester_email'
  },
  requesterPhone: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'requester_phone'
  },
  providerId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'provider_id'
  },
  providerName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'provider_name'
  },
  providerEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'provider_email'
  },
  providerPhone: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'provider_phone'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_price'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
  }
}, {
  tableName: 'rental_bookings',
  timestamps: true,
  underscored: true
});

module.exports = RentalBooking;
