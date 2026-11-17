const cron = require("node-cron");
const Issue = require("../models/Issue");
const { calculatePriority } = require("../utils/priorityScore");

const PRIORITY_RANK = { low: 1, medium: 2, high: 3 };

// Overlap se bachav: pichla run abhi chal raha ho to naya shuru mat karo
let isRunning = false;

// Business logic alag function mein: cron ke bina bhi chala aur test kar sakte hain
const runEscalation = async () => {
  if (isRunning) return { skipped: true };
  isRunning = true;

  const summary = { checked: 0, updated: 0, escalated: 0 };

  try {
    const now = new Date();

    // cursor(): saare issues ek saath memory mein nahi, ek ek karke stream hote hain
    const cursor = Issue.find({ status: { $ne: "resolved" } }).cursor();

    for await (const issue of cursor) {
      summary.checked += 1;

      const { score, priority, breakdown } = calculatePriority(issue, now);

      // Kuch badla hi nahi to save mat karo (idempotent)
      if (score === issue.priorityScore && priority === issue.priority) {
        continue;
      }

      const wentUp = PRIORITY_RANK[priority] > PRIORITY_RANK[issue.priority];
      if (wentUp) {
        const reason =
          breakdown.overduePts > 0 ? "SLA deadline missed" : "issue ageing";
        issue.statusHistory.push({
          status: issue.status,
          note: `Auto-escalated to ${priority.toUpperCase()} priority (score ${score}): ${reason}`,
        });
        summary.escalated += 1;
      }

      await issue.save(); // hook score aur priority save kar deta hai
      summary.updated += 1;
    }
  } finally {
    isRunning = false; // error aaye tab bhi flag wapas false
  }

  return summary;
};

const startSlaJob = () => {
  const schedule = process.env.SLA_CRON || "0 * * * *"; // default: har ghante

  if (!cron.validate(schedule)) {
    console.error(`Invalid SLA_CRON expression: ${schedule}`);
    return;
  }

  cron.schedule(schedule, async () => {
    try {
      const summary = await runEscalation();
      console.log("[SLA job]", summary);
    } catch (error) {
      console.error("[SLA job] failed:", error.message);
    }
  });

  console.log(`SLA escalation job scheduled (${schedule})`);
};

module.exports = { runEscalation, startSlaJob };
