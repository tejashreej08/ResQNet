function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function classifyWaterRisk(waterLevel, threshold) {
  if (!Number.isFinite(waterLevel) || !Number.isFinite(threshold) || threshold <= 0) {
    return {
      level: "unknown",
      score: null,
      message: "Invalid water-level data"
    };
  }

  const ratio = waterLevel / threshold;

  if (ratio >= 1.5) return { level: "critical", score: 90 };
  if (ratio >= 1.2) return { level: "high", score: 75 };
  if (ratio >= 0.8) return { level: "medium", score: 50 };

  return { level: "safe", score: 20 };
}

function classifyGenericRisk(sensor) {
  if (sensor.type === "water_level") {
    return classifyWaterRisk(sensor.waterLevel, sensor.threshold);
  }

  if (sensor.type === "seismic") {
    if (sensor.intensity >= 7) return { level: "critical", score: 95 };
    if (sensor.intensity >= 5) return { level: "high", score: 80 };
    if (sensor.intensity >= 3) return { level: "medium", score: 55 };
    return { level: "safe", score: 20 };
  }

  if (sensor.type === "structural") {
    if (sensor.strain >= 90) return { level: "critical", score: 95 };
    if (sensor.strain >= 70) return { level: "high", score: 80 };
    if (sensor.strain >= 50) return { level: "medium", score: 55 };
    return { level: "safe", score: 20 };
  }

  return {
    level: "unknown",
    score: null,
    message: "Unsupported sensor type"
  };
}

module.exports = {
  clamp,
  classifyWaterRisk,
  classifyGenericRisk
};
