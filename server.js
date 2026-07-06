require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

require("./config/db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/api", (req, res) => res.json({ message: "TaskFlow Pro API is running" }));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Route not found" });
  }
  res.sendFile(path.join(__dirname, "../frontend", "404.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`TaskFlow Pro server running on port ${port}`);
});