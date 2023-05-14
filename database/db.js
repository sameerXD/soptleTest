const express = require("express");
const { Sequelize } = require("sequelize");

// Import your routes and other middleware as needed

const app = express();

// Sequelize initialization
const sequelize = new Sequelize("soptel", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const FlightConfiguration = require("./models/FlightConfiguration");
const Flight = require("./models/Flight");
const User = require("./models/User");
const Booking = require("./models/Booking");
const Route = require("./models/Route");

// Synchronize models

Flight(sequelize);
Route(sequelize);
User(sequelize);
Booking(sequelize);
FlightConfiguration(sequelize);

// Define associations
Flight.associate = (models) => {
  Flight.belongsTo(models.FlightConfiguration, {
    foreignKey: "configurationId",
    as: "configuration",
  });
};

Flight.associate = (models) => {
  Flight.belongsTo(models.Route, {
    foreignKey: "routeId",
    as: "route",
  });
};

User.associate = (models) => {
  User.hasMany(models.Flight, {
    foreignKey: "userId",
    as: "flights",
  });
};

Flight.associate = (models) => {
  Flight.hasMany(models.Booking);
};

Booking.associate = (models) => {
  Booking.belongsTo(models.Flight, {foreignKey:"flightId", as :"flight"});
};

// Define associations

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Models synchronized with the database.");
  })
  .catch((error) => {
    console.error("Unable to synchronize models:", error);
  });

module.exports = {
  Route,
  Flight,
  User,
  FlightConfiguration,
  Booking,
  sequelize,
};
