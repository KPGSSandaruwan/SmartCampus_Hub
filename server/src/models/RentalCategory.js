const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RentalCategory = sequelize.define('RentalCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  itemCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'item_count'
  },
  startingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 200.00,
    field: 'starting_price'
  },
}, {
  tableName: 'rental_categories',
  timestamps: true,
  underscored: true,
  getterMethods: {
    _id() {
      return this.id ? this.id.toString() : null;
    }
  }
});

module.exports = RentalCategory;
