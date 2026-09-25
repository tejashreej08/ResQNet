const express = require("express");
const router = express.Router();
const { sensors } = require("../store");

router.get("/", (req, res) => res.json(sensors));

router.post("/", (req, res) => {
  const { type, location, disasterId } = req.body;

  if (!type || !location || !disasterId) {
    return res.status(400).json({
      message: "type, location, and disasterId are required"
    });
  }

  const newSensor = {
    id: `S${String(sensors.length + 1).padStart(3, "0")}`,
    ...req.body,
    timestamp: new Date().toISOString()
  };

  sensors.push(newSensor);

  const io = req.app.get("io");
  if (io) io.emit("sensor:update", newSensor);

  res.status(201).json(newSensor);
});

router.patch("/:id", (req, res) => {
  const index = sensors.findIndex((sensor) => sensor.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Sensor not found" });

  sensors[index] = {
    ...sensors[index],
    ...req.body,
    timestamp: new Date().toISOString()
  };

  const io = req.app.get("io");
  if (io) io.emit("sensor:update", sensors[index]);

  res.json(sensors[index]);
});

module.exports = router;
