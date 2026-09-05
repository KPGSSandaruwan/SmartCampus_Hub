const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  images: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('images');
      try {
        return val ? JSON.parse(val) : [];
      } catch (e) {
        return val ? val.split(',') : [];
      }
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val || []));
    }
  },
  details: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('details');
      try {
        return val ? JSON.parse(val) : {};
      } catch (e) {
        return {};
      }
    },
    set(val) {
      this.setDataValue('details', JSON.stringify(val || {}));
    }
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'owner_id',
    references: {
      model: User,
      key: 'id'
    }
  },
}, {
  tableName: 'listings',
  timestamps: true,
  underscored: true,
  getterMethods: {
    _id() {
      return this.id ? this.id.toString() : null;
    }
  }
});

// Associations
Listing.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(Listing, { foreignKey: 'owner_id', as: 'listings' });

module.exports = Listing;
