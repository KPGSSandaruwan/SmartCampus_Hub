const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Job = require('./Job');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'job_id',
    references: {
      model: Job,
      key: 'id'
    }
  },
  applicantName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  applicantEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  applicantPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'applied'
  }
}, {
  tableName: 'job_applications',
  timestamps: true,
  underscored: true
});

Job.hasMany(JobApplication, { foreignKey: 'job_id', as: 'applications' });
JobApplication.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

module.exports = JobApplication;
