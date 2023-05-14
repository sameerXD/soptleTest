// models/Flight.js

const { Sequelize, DataTypes } = require('sequelize');
const FlightConfiguration = require('./FlightConfiguration');

module.exports = (sequelize) => {
  const Flight = sequelize.define('Flight', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    configurationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });


  return Flight;
};
