const Issue = require("../models/Issue");

// @route   POST /api/issues
// @access  Private (citizen)
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      imageUrl,
      latitude,
      longitude,
      address,
      ward,
    } = req.body;

    if (
      !title ||
      !category ||
      !imageUrl ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "title, category, imageUrl, latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // Sirf allowed fields. status/priority/reportedBy client se nahi lete
    const issue = await Issue.create({
      title,
      description,
      category,
      imageUrl,
      location: { type: "Point", coordinates: [lng, lat] }, // [longitude, latitude]
      address,
      ward,
      reportedBy: req.user._id,
    });

    res.status(201).json({ issue });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createIssue };