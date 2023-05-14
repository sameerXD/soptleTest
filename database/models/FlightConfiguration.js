const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FlightConfiguration = sequelize.define('FlightConfiguration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seatingCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrangement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return FlightConfiguration;
};
