const express = require("express");
const router = express.Router();

const { sensors, victims, roads, teams } = require("../store");
const { buildRescueState, calculateRoute } = require("../services/orchestrator");

router.get("/state", (req, res) => {
  res.json(buildRescueState({ sensors, victims, roads, teams }));
});

router.post("/replan", (req, res) => {
  const { start, end } = req.body;

  const state = buildRescueState({ sensors, victims, roads, teams });
  const route = start && end ? calculateRoute(roads, start, end) : null;

  const result = {
    message: "Live rescue plan recalculated",
    generatedAt: new Date().toISOString(),
    state,
    route
  };

  const io = req.app.get("io");
  if (io) io.emit("orchestration:update", result);

  res.json(result);
});

module.exports = router;
