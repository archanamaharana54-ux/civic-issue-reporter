const mongoose = require("mongoose");
const Issue = require("../models/Issue");

// [{ _id: "pothole", count: 3 }] -> { pothole: 3 }
const toMap = (arr) =>
  arr.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

// $count ka result [{ count: 5 }] ya [] hota hai
const firstCount = (arr) => (arr[0] ? arr[0].count : 0);

// @route   GET /api/stats/overview
// @access  Private (staff only)
const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [r] = await Issue.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
          byPriority: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],
          byWard: [
            { $match: { ward: { $ne: "" } } },
            { $group: { _id: "$ward", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          resolvedToday: [
            { $match: { resolvedAt: { $gte: startOfToday } } },
            { $count: "count" },
          ],
          sla: [
            {
              $match: {
                status: { $ne: "resolved" },
                dueAt: { $exists: true },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                overdue: {
                  $sum: { $cond: [{ $lt: ["$dueAt", now] }, 1, 0] },
                },
              },
            },
          ],
          avgResolution: [
            { $match: { status: "resolved", resolvedAt: { $exists: true } } },
            {
              $group: {
                _id: null,
                hours: {
                  $avg: {
                    $divide: [
                      { $subtract: ["$resolvedAt", "$createdAt"] },
                      1000 * 60 * 60,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const sla = r.sla[0] || { total: 0, overdue: 0 };
    const onTrackPercent =
      sla.total === 0
        ? 100
        : Math.round(((sla.total - sla.overdue) / sla.total) * 100);

    res.status(200).json({
      total: firstCount(r.total),
      byStatus: toMap(r.byStatus),
      byCategory: toMap(r.byCategory),
      byPriority: toMap(r.byPriority),
      byWard: r.byWard.map((w) => ({ ward: w._id, count: w.count })),
      resolvedToday: firstCount(r.resolvedToday),
      sla: {
        activeWithDeadline: sla.total,
        overdue: sla.overdue,
        onTrackPercent,
      },
      avgResolutionHours: r.avgResolution[0]
        ? Math.round(r.avgResolution[0].hours * 10) / 10
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/stats/my
// @access  Private (logged-in user ke apne issues)
const getMyStats = async (req, res) => {
  try {
    // aggregate() mein Mongoose auto-cast nahi karta, isliye ObjectId khud banate hain
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [r] = await Issue.aggregate([
      { $match: { reporters: userId } }, // pehle filter, phir facet
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          last7Days: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const total = firstCount(r.total);
    const byStatus = toMap(r.byStatus);
    const resolved = byStatus.resolved || 0;

    res.status(200).json({
      total,
      resolved,
      pending: total - resolved,
      byStatus,
      last7Days: r.last7Days.map((d) => ({ date: d._id, count: d.count })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getOverview, getMyStats };