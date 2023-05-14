const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const {Route, sequelize, FlightConfiguration, Flight} = require("../database/db");

exports.login = async(req, res)=>{
    try{
    const { email, password } = req.body;

    const user = {
        email:process.env.ADMIN_EMAIL,
        password:process.env.ADMIN_PASSWORD
    }

    if (user.email!==email.toLowerCase()) {
        return res.status(404).json({ error: 'User not found' });
        }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Password is correct, proceed with authentication or generate token
    // ...
    const token = jwt.sign({ email: user.email }, process.env.ADMIN_ACCESS_TOKEN, { expiresIn: '1h' });

    res.json({ token ,message: 'Login successful' });
    }catch(err){
      return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });

    }
}


exports.createRoute = async(req, res)=>{
  try{
    const {from , to}  = req.body;

    const postRoute = await Route(sequelize).create({from, to});

    res.send({data:postRoute, message: "route created"});

  }catch(err){
    console.log(err);
    res.send({Error:"INTERNAL SERVER ERROR"})
  }
}

exports.createFlightConfiguration = async(req, res)=>{
  try{
    const {seatingCapacity , arrangement}  = req.body;

    const postFlightConfiguration = await FlightConfiguration(sequelize).create({seatingCapacity, arrangement});

    res.send({data:postFlightConfiguration, message: "flight configuration created"});

  }catch(err){
    console.log(err);
    res.send({Error:"INTERNAL SERVER ERROR"})
  }
}

exports.createFlight = async(req, res)=>{
  try{
    const {routeId,configurationId, departureTime } = req.body;

    const getRoute = await Route(sequelize).findByPk(routeId);
    const getFlightConfiguration = await FlightConfiguration(sequelize).findByPk(configurationId);

    if(!getRoute) return res.status(404).send({error:"route not found"});
    if(!getFlightConfiguration) return res.status(404).send({error:"flight configuration not found"});

    const postCreateFlight = await Flight(sequelize).create({routeId:routeId,configurationId:configurationId, departureTime:departureTime});
    
    res.send({data:postCreateFlight, message: "flight created"});
  }catch(err){
    console.log(err);
    res.send({Error:"INTERNAL SERVER ERROR"})
  }
}