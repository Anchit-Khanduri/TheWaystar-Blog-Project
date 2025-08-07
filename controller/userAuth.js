require("dotenv").config();
const JWT = require("jsonwebtoken");

const secret = process.env.SECRET;

// Create JWT token with only _id and email
// If same user id and email then generate token 
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = JWT.sign(payload, secret, {
    expiresIn: "1d", // set token to expire in 7 days
  });

  return token;
}

// Verify and decode the token
function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
