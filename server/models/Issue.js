const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["pothole", "streetlight", "garbage"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["reported", "assigned", "in_progress", "resolved"],
      default: "reported",
    },
    reportCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Geo queries ke liye zaroori index
issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);