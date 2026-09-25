const express = require("express");
const router = express.Router();
const { teams } = require("../store");

router.get("/", (req, res) => res.json(teams));

router.patch("/:id/status", (req, res) => {
  const team = teams.find((item) => item.id === req.params.id);

  if (!team) return res.status(404).json({ message: "Team not found" });

  const allowedStatuses = ["available", "busy", "offline"];

  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status", allowedStatuses });
  }

  team.status = req.body.status;

  const io = req.app.get("io");
  if (io) io.emit("team:update", team);

  res.json(team);
});

module.exports = router;
