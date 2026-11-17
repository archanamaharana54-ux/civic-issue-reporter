require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { startSlaJob } = require("./jobs/slaEscalation");

connectDB();
startSlaJob();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Civic Issue Reporter API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", time: new Date() });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/stats", statsRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});