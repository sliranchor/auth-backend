const jwt = require("jsonwebtoken");
require('dotenv').config();

function generateJWT(user_id) {
  const expiry = 3600;
  const payload = {
    user: user_id
  }

   return jwt.sign(payload, process.env.jwtSecret, {expiresIn: expiry})
}

module.exports = generateJWT;