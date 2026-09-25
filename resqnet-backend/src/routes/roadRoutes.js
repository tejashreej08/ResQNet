const express = require("express");
const router = express.Router();
const { roads } = require("../store");

router.get("/", (req, res) => res.json(roads));

router.patch("/:id/status", (req, res) => {
  const road = roads.find((item) => item.id === req.params.id);

  if (!road) return res.status(404).json({ message: "Road not found" });

  if (!["open", "blocked"].includes(req.body.status)) {
    return res.status(400).json({ message: "Status must be open or blocked" });
  }

  road.status = req.body.status;

  const io = req.app.get("io");
  if (io) io.emit("road:update", road);

  res.json(road);
});

module.exports = router;
