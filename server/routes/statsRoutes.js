const express = require("express");
const { getOverview, getMyStats } = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/overview", protect, authorize("staff"), getOverview);
router.get("/my", protect, getMyStats);

module.exports = router;