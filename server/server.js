require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

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

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);