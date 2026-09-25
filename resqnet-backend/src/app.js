const express = require("express");
const cors = require("cors");

const disasterRoutes = require("./routes/disasterRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const riskRoutes = require("./routes/riskRoutes");
const victimRoutes = require("./routes/victimRoutes");
const roadRoutes = require("./routes/roadRoutes");
const routeRoutes = require("./routes/routeRoutes");
const teamRoutes = require("./routes/teamRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const orchestrationRoutes = require("./routes/orchestrationRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS blocked for origin: " + origin));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "ResQNet Backend",
    message: "Adaptive disaster rescue orchestration API",
    version: "1.0.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "ResQNet Backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/disasters", disasterRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/victims", victimRoutes);
app.use("/api/roads", roadRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/orchestration", orchestrationRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
});

module.exports = app;
