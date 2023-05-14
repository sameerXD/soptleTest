// models/Booking.js

const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Booking;
};
