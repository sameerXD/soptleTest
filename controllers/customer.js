const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  Route,
  sequelize,
  FlightConfiguration,
  Flight,
  User,
  Booking,
} = require("../database/db");

const { Op, Sequelize } = require('sequelize');


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const getUser = await User(sequelize).findOne({ where: { email } });

    console.log(getUser);
    if (getUser)
      return res.json({ error: "user with this email already exist" });
    // Create a new user
    const user = await User(sequelize).create({
      name,
      email,
      password: hashedPassword, // Store the hashed password in the database
    });

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const getUser = await User(sequelize).findOne({ where: { email } });

    if (!getUser)
      return res.send({ error: "user with this email was not found" });

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, getUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Password is correct, proceed with authentication or generate token
    // ...
    const token = jwt.sign(
      { email: getUser.email },
      process.env.CUSTOMER_TOKEN,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

exports.searchFlightsBYRoutes = async (req, res) => {
  try {
    const { from, to } = req.body;

    // search routes with these inputs
    const getRoutes = await Route(sequelize).findAll({ where: { from, to } });

    const flights = [];

    // loop through the array and search for flights with that route
    // also taking care that the flights are in future
    const currentDate = new Date();

    for (const route of getRoutes) {
      const getFLight = await Flight(sequelize).findAll({
        where: {
          routeId: route.id,
          departureTime: {
            [Op.gte]: currentDate,
          },
          
        },
      });

      if(getFLight) {
        flights.push(getFLight);
      }
    }

    res.send({flights, message: "routes searched!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

exports.bookFlight = async(req, res)=>{
  try{
    const {flightId, seatNumber} = req.body;

    // search flight 
    const getFlight = await Flight(sequelize).findByPk(flightId);

    if(!getFlight) return res.send({error:"this flight does not exist"});

    const getFlightConfig = await FlightConfiguration(sequelize).findByPk(getFlight.configurationId);

    const seatingCapacity = getFlightConfig.seatingCapacity;

    if(seatNumber<=0 || seatNumber>seatingCapacity) return res.send({error:"seat number is exceeding the limit"});
    const getBookingBySeatNumberAndFlightId = await Booking(sequelize).findOne({
      where:{
        flightId,
        seatNumber
      }
    });

    if(getBookingBySeatNumberAndFlightId) return res.send({error:"this seat is occupied"});

    const postBooking = await Booking(sequelize).create({
      seatNumber,
      flightId
    });

    res.send({data: postBooking, message: "booking created!"});

  }catch(err){
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
}

exports.getAllEmptySeats = async(req, res)=>{
  try{
    const {flightId} = req.body;

    const getFlight = await Flight(sequelize).findByPk(flightId);

    if(!getFlight) return res.send({message:"hey wrong flight id"});

    const getFlightConfig = await FlightConfiguration(sequelize).findByPk(getFlight.configurationId);

    const seatingCapacity = getFlightConfig.seatingCapacity;


    let seatingArrangement ={};
    for (let i = 0; i < seatingCapacity; i++) {
      seatingArrangement[i+1] = ({seatOccupied: false, seatNumber:i+1});
    }

    const getAllBookings = await Booking(sequelize).findAll({
      where:{
        flightId
      }
    });

    getAllBookings.forEach(booking => {
      seatingArrangement[booking.seatNumber]["seatOccupied"] = true;
    });    

    return res.send({data:seatingArrangement, message:"sitting arrangement"})
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
}