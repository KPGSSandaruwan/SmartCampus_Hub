const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Parcel = require('./Parcel');
const Rider = require('./Rider');

const ParcelAssignment = sequelize.define('ParcelAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parcelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'parcel_id',
    references: {
      model: Parcel,
      key: 'id'
    }
  },
  riderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'rider_id',
    references: {
      model: Rider,
      key: 'id'
    }
  }
}, {
  tableName: 'parcel_assignments',
  timestamps: true,
  underscored: true
});

// Relationships
Parcel.hasOne(ParcelAssignment, { foreignKey: 'parcel_id', as: 'assignment' });
ParcelAssignment.belongsTo(Parcel, { foreignKey: 'parcel_id', as: 'parcelDetails' });

Rider.hasMany(ParcelAssignment, { foreignKey: 'rider_id' });
ParcelAssignment.belongsTo(Rider, { foreignKey: 'rider_id', as: 'riderDetails' });

module.exports = ParcelAssignment;
