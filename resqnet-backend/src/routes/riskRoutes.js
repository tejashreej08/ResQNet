const express = require("express");
const router = express.Router();
const { sensors } = require("../store");
const { classifyGenericRisk } = require("../services/riskEngine");

router.get("/", (req, res) => {
  const results = sensors.map((sensor) => ({
    sensorId: sensor.id,
    disasterId: sensor.disasterId,
    location: sensor.location,
    ...classifyGenericRisk(sensor),
    timestamp: sensor.timestamp
  }));

  res.json({
    generatedAt: new Date().toISOString(),
    results
  });
});

module.exports = router;
