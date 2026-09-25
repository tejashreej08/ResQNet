const { classifyGenericRisk } = require("./riskEngine");
const { calculateRescueScore } = require("./priorityEngine");
const { dijkstra } = require("./routingEngine");

function buildRescueState({ sensors, victims, roads, teams }) {
  const riskData = sensors.map((sensor) => ({
    sensorId: sensor.id,
    location: sensor.location,
    disasterId: sensor.disasterId,
    ...classifyGenericRisk(sensor),
    timestamp: sensor.timestamp
  }));

  const priorityData = victims
    .filter((victim) => victim.status === "waiting")
    .map((victim) => ({
      ...victim,
      ...calculateRescueScore(victim)
    }))
    .sort((a, b) => b.rescueScore - a.rescueScore);

  const availableTeams = teams.filter(
    (team) => team.status === "available"
  );

  return {
    generatedAt: new Date().toISOString(),
    riskData,
    priorityData,
    availableTeams,
    roadSummary: {
      total: roads.length,
      open: roads.filter((road) => road.status === "open").length,
      blocked: roads.filter((road) => road.status === "blocked").length
    }
  };
}

function calculateRoute(roads, start, end) {
  return dijkstra(roads, start, end);
}

module.exports = {
  buildRescueState,
  calculateRoute
};
