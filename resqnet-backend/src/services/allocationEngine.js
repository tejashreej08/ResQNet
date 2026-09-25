function calculateDistance(pointA, pointB) {
  const latDiff = Number(pointA.lat) - Number(pointB.lat);
  const lngDiff = Number(pointA.lng) - Number(pointB.lng);

  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

function allocateTeam(victim, teams, disasterType = "flood") {
  const availableTeams = teams.filter((team) => {
    return (
      team.status === "available" &&
      team.capacity >= Number(victim.groupSize || 1) &&
      (!team.capabilities || team.capabilities.includes(disasterType))
    );
  });

  if (availableTeams.length === 0) {
    return {
      success: false,
      message: "No suitable available rescue team"
    };
  }

  let selectedTeam = null;
  let shortestDistance = Infinity;

  for (const team of availableTeams) {
    const distance = calculateDistance(victim.location, team.location);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      selectedTeam = team;
    }
  }

  return {
    success: true,
    team: selectedTeam,
    approximateDistance: shortestDistance
  };
}

module.exports = {
  calculateDistance,
  allocateTeam
};
