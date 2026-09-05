const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  universityId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'university_id'
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'student'
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 4.8
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  getterMethods: {
    _id() {
      return this.id ? this.id.toString() : null;
    }
  },
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  }
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
