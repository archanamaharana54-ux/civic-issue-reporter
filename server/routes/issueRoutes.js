const express = require("express");
const {
  createIssue,
  getMyIssues,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
} = require("../controllers/issueController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createIssue);
router.get("/", protect, authorize("staff"), getAllIssues);

// "/my" ko "/:id" se PEHLE likhna zaroori hai
router.get("/my", protect, getMyIssues);

router.get("/:id", protect, getIssueById);
router.patch("/:id/status", protect, authorize("staff"), updateIssueStatus);

module.exports = router;