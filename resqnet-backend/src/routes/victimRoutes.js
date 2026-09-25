const express = require("express");
const router = express.Router();
const { victims } = require("../store");
const { calculateRescueScore } = require("../services/priorityEngine");

router.get("/", (req, res) => res.json(victims));

router.get("/priority", (req, res) => {
  const results = victims
    .filter((victim) => victim.status === "waiting")
    .map((victim) => ({
      ...victim,
      ...calculateRescueScore(victim)
    }))
    .sort((a, b) => b.rescueScore - a.rescueScore);

  res.json(results);
});

router.post("/", (req, res) => {
  const requiredFields = [
    "name", "location", "age", "medicalNeed", "groupSize",
    "hazardSeverity", "timeSinceContact", "disasterId"
  ];

  const missing = requiredFields.filter((field) => req.body[field] === undefined);

  if (missing.length > 0) {
    return res.status(400).json({ message: "Missing required fields", missing });
  }

  const newVictim = {
    id: `V${String(victims.length + 1).padStart(3, "0")}`,
    ...req.body,
    status: "waiting",
    createdAt: new Date().toISOString()
  };

  victims.push(newVictim);

  const io = req.app.get("io");
  if (io) io.emit("victim:update", newVictim);

  res.status(201).json(newVictim);
});

router.patch("/:id/status", (req, res) => {
  const victim = victims.find((item) => item.id === req.params.id);

  if (!victim) return res.status(404).json({ message: "Victim not found" });

  const allowedStatuses = ["waiting", "assigned", "rescued", "cancelled"];

  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status", allowedStatuses });
  }

  victim.status = req.body.status;

  const io = req.app.get("io");
  if (io) io.emit("victim:update", victim);

  res.json(victim);
});

module.exports = router;
