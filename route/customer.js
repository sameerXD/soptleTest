const router = require("express").Router();
const customerController = require("../controllers/customer");
const customerAuth= require("../middleware/CustomerAuth");
router.post("/register",customerController.register);
router.post("/login",customerController.login);
router.post("/searchFlightsBYRoutes",customerAuth.authenticateToken,customerController.searchFlightsBYRoutes);
router.post("/bookFlight",customerAuth.authenticateToken,customerController.bookFlight);
router.post("/getAllEmptySeats",customerAuth.authenticateToken,customerController.getAllEmptySeats);

module.exports = router;