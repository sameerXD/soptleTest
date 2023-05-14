const router = require("express").Router();
const adminController = require("../controllers/admin");
const adminAuth= require("../middleware/AdminAuth");
router.post("/login",adminController.login);
router.post("/createRoute",adminAuth.authenticateToken, adminController.createRoute );
router.post("/createFlightConfiguration",adminAuth.authenticateToken, adminController.createFlightConfiguration );
router.post("/createFlight",adminAuth.authenticateToken, adminController.createFlight );

module.exports = router;