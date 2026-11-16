const Issue = require("../models/Issue");

const DUPLICATE_RADIUS_METERS = 50;

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

    // 1. Duplicate dhoondho: 50 m ke andar, same category, unresolved
    const nearby = await Issue.findOne({
      category,
      status: { $ne: "resolved" },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: DUPLICATE_RADIUS_METERS,
        },
      },
    });

    if (nearby) {
      // 2. Ye user pehle hi report kar chuka hai
      const alreadyReported = nearby.reporters.some(
        (id) => id.toString() === req.user._id.toString()
      );
      if (alreadyReported) {
        return res.status(409).json({
          message: "You have already reported this issue",
          issue: nearby,
        });
      }

      // 3. Naya reporter: count badhao, reporter add karo
      const update = {
        $inc: { reportCount: 1 },
        $addToSet: { reporters: req.user._id },
      };
      if (nearby.reportCount + 1 >= 5) {
        update.$set = { priority: "high" };
      }

      const merged = await Issue.findByIdAndUpdate(nearby._id, update, {
        new: true,
      });

      return res.status(200).json({ merged: true, issue: merged });
    }

    // 4. Duplicate nahi mila: naya issue banao
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

    res.status(201).json({ merged: false, issue });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createIssue };