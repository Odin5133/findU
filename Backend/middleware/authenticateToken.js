const jwt = require("jsonwebtoken");
require("dotenv").config();
const Key = process.env.JWT_SECRET;

// console.log(Key);

const authToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ err: "Access Denied" });

  try {
    const verified = jwt.verify(token, Key);
    console.log(verified);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ err: "Invalid Token" });
  }
};

module.exports = authToken;
