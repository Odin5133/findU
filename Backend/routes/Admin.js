const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const Key = process.env.JWT_SECRET;

const admin = {
  uname: "admin",
  pword: "admin",
};

router.post("/login", (req, res) => {
  const { uname, pword } = req.body;
  console.log(uname, pword);
  if (uname === admin.uname && pword === admin.pword) {
    const token = jwt.sign({ uname }, Key, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = router;
