// models/User.js

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  });

  return Route;
};

