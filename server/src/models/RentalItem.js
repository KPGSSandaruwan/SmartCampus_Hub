const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RentalItem = sequelize.define('RentalItem', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  dailyPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  specs: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('specs');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('specs', value ? JSON.stringify(value) : null);
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'owner_id'
  },
  ownerName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ownerEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ownerPhone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  deposit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
  }
}, {
  tableName: 'rental_items',
  timestamps: true,
  underscored: true
});

module.exports = RentalItem;
