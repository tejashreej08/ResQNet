const express = require("express");
const router = express.Router();
const { roads } = require("../store");
const { dijkstra } = require("../services/routingEngine");

router.get("/", (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      message: "start and end query parameters are required"
    });
  }

  res.json(dijkstra(roads, start, end));
});

module.exports = router;
