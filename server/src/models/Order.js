const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Listing = require('./Listing');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  listingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'listing_id',
    references: {
      model: Listing,
      key: 'id'
    }
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'requester_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'provider_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price'
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  getterMethods: {
    _id() {
      return this.id ? this.id.toString() : null;
    }
  }
});

// Associations
Order.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });
Order.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });
Order.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

Listing.hasMany(Order, { foreignKey: 'listing_id', as: 'orders' });
User.hasMany(Order, { foreignKey: 'requester_id', as: 'requests' });
User.hasMany(Order, { foreignKey: 'provider_id', as: 'provisions' });

module.exports = Order;
