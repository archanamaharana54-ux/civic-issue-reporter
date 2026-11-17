const mongoose = require("mongoose");
const { calculatePriority } = require("../utils/priorityScore");

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["reported", "assigned", "in_progress", "resolved"],
      required: true,
    },
    note: { type: String, default: "" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
    },
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
    address: { type: String, default: "" },
    ward: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    priorityScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["reported", "assigned", "in_progress", "resolved"],
      default: "reported",
    },
    reportCount: { type: Number, default: 1 },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reporters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dueAt: { type: Date },
    resolvedAt: { type: Date },
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

// Save se pehle: reportId, reporters aur pehli timeline entry set karo
issueSchema.pre("validate", function () {
  if (!this.reportId) {
    const d = new Date();
    const ymd =
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.reportId = `CR${ymd}${rand}`;
  }

  if (this.isNew) {
    if (this.reporters.length === 0 && this.reportedBy) {
      this.reporters.push(this.reportedBy);
    }
    if (this.statusHistory.length === 0) {
      this.statusHistory.push({
        status: "reported",
        note: "Issue reported",
        changedBy: this.reportedBy,
      });
    }
  }
});

// Har save par priority score aur level apne aap nikal lo
issueSchema.pre("save", function () {
  const { score, priority } = calculatePriority(this);
  this.priorityScore = score;
  this.priority = priority;
});

// Indexes
issueSchema.index({ location: "2dsphere" });
issueSchema.index({ status: 1, category: 1 });
issueSchema.index({ reportedBy: 1, createdAt: -1 });
issueSchema.index({ priorityScore: -1 });

module.exports = mongoose.model("Issue", issueSchema);