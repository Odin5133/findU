const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  photo: { type: String, required: true },
  scaledPhoto: { type: String }, // Add this line
  address: { type: String, required: true },
  coord: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  phoneNumber: { type: String },
  email: { type: String },
  owner: { type: String, required: true },
});

module.exports = mongoose.model("Profile", profileSchema);
