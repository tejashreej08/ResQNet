const express = require("express");
const router = express.Router();
const { disasters } = require("../store");

router.get("/", (req, res) => res.json(disasters));

router.get("/:id", (req, res) => {
  const disaster = disasters.find((item) => item.id === req.params.id);
  if (!disaster) return res.status(404).json({ message: "Disaster not found" });
  res.json(disaster);
});

module.exports = router;
