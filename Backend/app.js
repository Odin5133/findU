const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const profileRoutes = require("./routes/profiles");
const adminRoutes = require("./routes/Admin");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const MONGO_URI = "mongodb://localhost:27017/";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/profiles", profileRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3000, () => {
  console.log(`Server is running on localhost:3000`);
});
