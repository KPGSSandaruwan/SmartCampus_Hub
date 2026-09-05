const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  providerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payRate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxApplicants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  applicantsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'open'
  },
}, {
  tableName: 'jobs',
  timestamps: true,
  underscored: true,
  getterMethods: {
    _id() {
      return this.id ? this.id.toString() : null;
    }
  }
});

module.exports = Job;
