const mongoose = require("mongoose");
const Issue = require("../models/Issue");

const DUPLICATE_RADIUS_METERS = 50;
const VALID_STATUSES = ["reported", "assigned", "in_progress", "resolved"];
const SLA_HOURS = 48;

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

      // 3. Count atomic tarike se badhao, phir save() se hook score nikal dega
      const merged = await Issue.findByIdAndUpdate(
        nearby._id,
        {
          $inc: { reportCount: 1 },
          $addToSet: { reporters: req.user._id },
        },
        { new: true }
      );
      await merged.save();

      return res.status(200).json({ merged: true, issue: merged });
    }

    // 4. Duplicate nahi mila: naya issue banao (hook score khud nikal dega)
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

// @route   GET /api/issues/my
// @access  Private (citizen: apne reported ya merged issues)
const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reporters: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ count: issues.length, issues });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/issues?status=&category=&ward=&priority=&page=&limit=
// @access  Private (staff only)
const getAllIssues = async (req, res) => {
  try {
    const { status, category, ward, priority, page, limit } = req.query;

    // Sirf string values filter mein jayengi (NoSQL injection se bachav)
    const filter = {};
    if (typeof status === "string") filter.status = status;
    if (typeof category === "string") filter.category = category;
    if (typeof ward === "string") filter.ward = ward;
    if (typeof priority === "string") filter.priority = priority;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("reportedBy", "name email")
        .populate("assignedTo", "name"),
      Issue.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      issues,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/issues/:id
// @access  Private (reporter ya staff)
const getIssueById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid issue id" });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Object-level authorization: citizen sirf apna issue dekh sakta hai
    const isReporter = issue.reporters.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (req.user.role !== "staff" && !isReporter) {
      return res.status(403).json({ message: "Not allowed to view this issue" });
    }

    res.status(200).json({ issue });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route   PATCH /api/issues/:id/status
// @access  Private (staff only)
const updateIssueStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid issue id" });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;

    if (status === "assigned") {
      issue.assignedTo = req.user._id;
      if (!issue.dueAt) {
        issue.dueAt = new Date(Date.now() + SLA_HOURS * 60 * 60 * 1000);
      }
    }
    if (status === "resolved") {
      issue.resolvedAt = new Date();
    }

    issue.statusHistory.push({
      status,
      note: typeof note === "string" ? note : "",
      changedBy: req.user._id,
    });

    await issue.save(); // hook se priorityScore bhi update hoga

    res.status(200).json({ issue });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createIssue,
  getMyIssues,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
};