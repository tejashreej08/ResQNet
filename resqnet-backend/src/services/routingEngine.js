function buildGraph(roads) {
  const graph = {};

  for (const road of roads) {
    if (road.status === "blocked") continue;

    if (!graph[road.from]) graph[road.from] = [];
    if (!graph[road.to]) graph[road.to] = [];

    const weight = Number(road.travelTime) + Number(road.riskPenalty || 0);

    graph[road.from].push({
      node: road.to,
      weight,
      roadId: road.id
    });

    graph[road.to].push({
      node: road.from,
      weight,
      roadId: road.id
    });
  }

  return graph;
}

function dijkstra(roads, start, end) {
  const graph = buildGraph(roads);
  const nodes = new Set(Object.keys(graph));

  if (!nodes.has(start) || !nodes.has(end)) {
    return {
      success: false,
      path: [],
      distance: null,
      message: "Start or end node not found"
    };
  }

  const distances = {};
  const previous = {};
  const previousRoad = {};

  for (const node of nodes) {
    distances[node] = Infinity;
    previous[node] = null;
    previousRoad[node] = null;
  }

  distances[start] = 0;

  while (nodes.size > 0) {
    let current = null;
    let smallestDistance = Infinity;

    for (const node of nodes) {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        current = node;
      }
    }

    if (current === null) break;

    nodes.delete(current);

    if (current === end) break;

    for (const neighbor of graph[current]) {
      if (!nodes.has(neighbor.node)) continue;

      const candidate = distances[current] + neighbor.weight;

      if (candidate < distances[neighbor.node]) {
        distances[neighbor.node] = candidate;
        previous[neighbor.node] = current;
        previousRoad[neighbor.node] = neighbor.roadId;
      }
    }
  }

  if (distances[end] === Infinity) {
    return {
      success: false,
      path: [],
      distance: null,
      message: "No available route"
    };
  }

  const path = [];
  const roadIds = [];
  let current = end;

  while (current !== null) {
    path.unshift(current);

    if (previousRoad[current]) {
      roadIds.unshift(previousRoad[current]);
    }

    current = previous[current];
  }

  return {
    success: true,
    path,
    roadIds,
    distance: distances[end],
    message: "Route calculated"
  };
}

module.exports = {
  buildGraph,
  dijkstra
};
