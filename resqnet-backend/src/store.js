const { Client } = require("pg");

const disasters = require("./data/disasters.json");
const sensors = require("./data/sensors.json");
const victims = require("./data/victims.json");
const roads = require("./data/roads.json");
const teams = require("./data/rescueTeams.json");

const store = {
  disasters,
  sensors,
  victims,
  roads,
  teams
};

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parsePointFromGeometry(geom, fallback = { lat: 0, lng: 0 }) {
  if (!geom) return fallback;

  if (typeof geom === "string") {
    try {
      const parsed = JSON.parse(geom);
      if (parsed && Array.isArray(parsed.coordinates) && parsed.type === "Point") {
        return {
          lat: toNumber(parsed.coordinates[1]),
          lng: toNumber(parsed.coordinates[0])
        };
      }
      const match = geom.match(/POINT\(([-0-9.]+)\s+([-0-9.]+)\)/i);
      if (match) {
        return { lat: toNumber(match[2]), lng: toNumber(match[1]) };
      }
    } catch (error) {
      const match = geom.match(/POINT\(([-0-9.]+)\s+([-0-9.]+)\)/i);
      if (match) {
        return { lat: toNumber(match[2]), lng: toNumber(match[1]) };
      }
    }
    return fallback;
  }

  if (typeof geom === "object") {
    if (Array.isArray(geom.coordinates)) {
      if (geom.type === "Point") {
        return {
          lat: toNumber(geom.coordinates[1]),
          lng: toNumber(geom.coordinates[0])
        };
      }
      if (geom.coordinates?.[0]?.[0] && Array.isArray(geom.coordinates[0])) {
        const first = geom.coordinates[0][0];
        return {
          lat: toNumber(first[1]),
          lng: toNumber(first[0])
        };
      }
    }

    if (typeof geom.x !== "undefined" || typeof geom.y !== "undefined") {
      return {
        lat: toNumber(geom.y ?? geom.latitude ?? geom.lat ?? fallback.lat),
        lng: toNumber(geom.x ?? geom.longitude ?? geom.lng ?? fallback.lng)
      };
    }
  }

  return fallback;
}

function normalizeRow(row) {
  if (!row) return row;

  return {
    ...row,
    location: row.location ?? parsePointFromGeometry(row.geom, { lat: 0, lng: 0 }),
    id: String(row.id ?? row.victim_id ?? row.team_id ?? row.road_id),
    name: row.name ?? row.team_name ?? "Unnamed",
    groupSize: row.group_size ?? row.groupSize ?? 1,
    medicalNeed: row.has_medical_need !== undefined
      ? (row.has_medical_need ? "critical" : "low")
      : row.medicalNeed,
    hazardSeverity: row.hazard_severity ?? row.hazardSeverity ?? 0,
    timeSinceContact: row.time_since_contact ?? row.timeSinceContact ?? 0,
    disasterId: row.disaster_id ?? row.disasterId ?? "DIS001",
    status: row.status ?? "waiting",
    teamType: row.team_type ?? row.teamType,
    isAvailable: row.is_available ?? row.isAvailable ?? true,
    geom: undefined
  };
}

async function hydrateFromPostgres() {
  if (process.env.USE_POSTGIS !== "true" || !process.env.POSTGIS_URI) {
    return;
  }

  const client = new Client({
    connectionString: process.env.POSTGIS_URI
  });

  try {
    await client.connect();

    const [victimResult, teamResult, roadResult, disasterResult] = await Promise.all([
      client.query("SELECT id, name, group_size, has_medical_need, rescue_score, ST_X(geom) AS lng, ST_Y(geom) AS lat FROM victims ORDER BY rescue_score DESC NULLS LAST"),
      client.query("SELECT id, name, team_type, is_available, ST_X(geom) AS lng, ST_Y(geom) AS lat FROM rescue_teams ORDER BY id"),
      client.query("SELECT id, name, from_node, to_node, status, distance FROM roads ORDER BY id"),
      client.query("SELECT id, name, severity, ST_AsGeoJSON(ST_Centroid(geom)) AS geom_json FROM risk_zones ORDER BY id")
    ]);

    store.victims.length = 0;
    store.victims.push(
      ...victimResult.rows.map((row) => ({
        id: String(row.id),
        name: row.name,
        location: {
          lat: toNumber(row.lat),
          lng: toNumber(row.lng)
        },
        age: 30,
        medicalNeed: row.has_medical_need ? "critical" : "low",
        groupSize: Number(row.group_size),
        hazardSeverity: 80,
        timeSinceContact: 0,
        status: "waiting",
        disasterId: "DIS001",
        rescueScore: Number(row.rescue_score ?? 0)
      }))
    );

    store.teams.length = 0;
    store.teams.push(
      ...teamResult.rows.map((row) => ({
        id: String(row.id),
        name: row.name,
        teamType: row.team_type,
        location: {
          lat: toNumber(row.lat),
          lng: toNumber(row.lng)
        },
        isAvailable: row.is_available,
        status: row.is_available ? "available" : "busy"
      }))
    );

    store.roads.length = 0;
    store.roads.push(
      ...roadResult.rows.map((row) => ({
        id: String(row.id),
        name: row.name ?? `Road ${row.id}`,
        status: row.status ?? "open",
        from: row.from_node ?? "N1",
        to: row.to_node ?? "N2",
        distance: Number(row.distance ?? 1)
      }))
    );

    store.disasters.length = 0;
    store.disasters.push(
      ...disasterResult.rows.map((row) => {
        const center = parsePointFromGeometry(row.geom_json);
        return {
          id: String(row.id),
          name: row.name,
          severity: row.severity,
          status: "active",
          zone: row.name,
          coordinates: center
        };
      })
    );

    console.log("PostGIS data loaded into store.");
  } catch (error) {
    console.error("PostGIS load failed, falling back to JSON fixtures:", error.message);
  } finally {
    await client.end();
  }
}

hydrateFromPostgres();

module.exports = store;
