const jwt = require('jsonwebtoken');
require("dotenv").config();


const authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Authentication successful, attach the decoded payload to the request object
    req.userId = decoded.userId;

    next();
  });
};


module.exports = {
    authenticateToken
}