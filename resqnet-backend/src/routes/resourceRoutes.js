const express = require("express");
const router = express.Router();

const { victims, teams, disasters } = require("../store");
const { calculateRescueScore } = require("../services/priorityEngine");
const { allocateTeam } = require("../services/allocationEngine");

router.post("/allocate/:victimId", (req, res) => {
  const victim = victims.find((item) => item.id === req.params.victimId);

  if (!victim) return res.status(404).json({ message: "Victim not found" });

  if (victim.status !== "waiting") {
    return res.status(400).json({ message: "Victim is not waiting for allocation" });
  }

  const disaster = disasters.find((item) => item.id === victim.disasterId);
  const priority = calculateRescueScore(victim);

  const allocation = allocateTeam(
    victim,
    teams,
    disaster ? disaster.type : "flood"
  );

  if (!allocation.success) return res.status(409).json(allocation);

  const team = teams.find((item) => item.id === allocation.team.id);

  team.status = "busy";
  victim.status = "assigned";
  victim.assignedTeamId = team.id;

  const result = {
    message: "Team allocated",
    victim,
    priority,
    team,
    approximateDistance: allocation.approximateDistance
  };

  const io = req.app.get("io");
  if (io) io.emit("allocation:update", result);

  res.json(result);
});

module.exports = router;
