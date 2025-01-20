const multer = require("multer");
const express = require("express");
const path = require("path");
const Profile = require("../views/Profile");
const authToken = require("../middleware/authenticateToken");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", authToken, upload.single("photo"), async (req, res) => {
  const { name, description, address, coordinates } = req.body;
  console.log(coordinates);
  try {
    coord = JSON.parse(coordinates);
  } catch (error) {
    return res.status(400).json({ error: "Invalid coordinates format" });
  }
  const photo = req.file ? req.file.path : null;
  const owner = name;
  console.log(coord.lng, coord.lat, owner);
  try {
    const newProfile = new Profile({
      name,
      photo,
      description,
      address,
      coord,
      owner,
    });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ error: "Error creating profile", details: error });
  }
});

router.post("/getProfileById", async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  try {
    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: "Error retrieving profile", details: error });
  }
});

router.put("/:id", authToken, upload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (req.file) updates.photo = req.file.path;

  if (updates.coordinates) {
    try {
      updates.coord = JSON.parse(updates.coordinates);
    } catch (error) {
      return res.status(400).json({ error: "Invalid coordinates format" });
    }
  }

  try {
    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    if (req.user.uname !== "admin" && profile.owner !== req.user.username) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this profile" });
    }
    const updatedProfile = await Profile.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: "Error updating profile" });
  }
});

router.delete("/:id", authToken, async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ err: "Profile not found" });
    // console.log(req.user.uname, profile.owner);
    if (req.user.uname !== "admin" && profile.owner !== req.user.username)
      return res.status(403).json({ err: "Access Denied" });
    await Profile.findByIdAndDelete(id);
    res.json({ msg: "Profile deleted" });
  } catch (err) {
    res.status(400).json({ err: err });
  }
});

router.get("/is-admin", authToken, (req, res) => {
  try {
    console.log(req.user);
    if (req.user && req.user.uname === "admin") {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.post("/search", async (req, res) => {
  const { userField } = req.body;
  try {
    const profiles = await Profile.find({
      $or: [
        { name: { $regex: userField, $options: "i" } },
        { address: { $regex: userField, $options: "i" } },
      ],
    }).select("id name");
    res.json(profiles);
  } catch (error) {
    res.status(400).json({ error: "Error searching profiles", details: error });
  }
});

module.exports = router;
