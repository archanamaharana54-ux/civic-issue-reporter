const CATEGORY_POINTS = { pothole: 30, streetlight: 25, garbage: 20 };
const POINTS_PER_REPORT = 6;
const MAX_REPORTS_COUNTED = 5; // 5 reports par report ke points max (30)
const POINTS_PER_DAY = 3;
const MAX_AGE_POINTS = 20;
const OVERDUE_POINTS = 20;

const HIGH_THRESHOLD = 60;
const MEDIUM_THRESHOLD = 40;

const DAY_MS = 24 * 60 * 60 * 1000;

// Pure function: sirf input leta hai, output deta hai (DB ko nahi chhoota)
const calculatePriority = (issue, now = new Date()) => {
  const categoryPts = CATEGORY_POINTS[issue.category] || 15;

  const reportPts =
    Math.min(issue.reportCount || 1, MAX_REPORTS_COUNTED) * POINTS_PER_REPORT;

  const created = issue.createdAt ? new Date(issue.createdAt) : now;
  const ageDays = Math.max((now - created) / DAY_MS, 0);
  const agePts = Math.min(Math.floor(ageDays) * POINTS_PER_DAY, MAX_AGE_POINTS);

  const isOverdue =
    issue.status !== "resolved" &&
    issue.dueAt &&
    new Date(issue.dueAt) < now;
  const overduePts = isOverdue ? OVERDUE_POINTS : 0;

  const score = categoryPts + reportPts + agePts + overduePts;

  let priority = "low";
  if (score >= HIGH_THRESHOLD) priority = "high";
  else if (score >= MEDIUM_THRESHOLD) priority = "medium";

  return {
    score,
    priority,
    breakdown: { categoryPts, reportPts, agePts, overduePts },
  };
};

module.exports = { calculatePriority };