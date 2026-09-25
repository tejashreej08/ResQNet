# ResQNet Backend

ResQNet is an adaptive Chennai disaster response orchestration prototype using live regional data and real route intelligence.

## Features

- Disaster scenario API
- Sensor and geospatial monitoring API
- Rule-based risk classification
- Explainable victim priority scoring
- Dijkstra route calculation
- Blocked-road simulation
- Rescue team allocation
- Automatic re-planning
- Socket.IO live events
- Optional MongoDB connection scaffold

## Tech Stack

- Node.js
- Express
- Socket.IO
- Real Chennai regional datasets
- Optional MongoDB/Mongoose

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

For macOS/Linux:

```bash
cp .env.example .env
npm install
npm run dev
```

Server:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Main APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/disasters` | List disasters |
| GET | `/api/disasters/:id` | Get one disaster |
| GET | `/api/sensors` | List sensors |
| POST | `/api/sensors` | Add live sensor reading |
| PATCH | `/api/sensors/:id` | Update sensor |
| GET | `/api/risk` | Calculate sensor risk |
| GET | `/api/victims` | List victims |
| GET | `/api/victims/priority` | Sorted priority list |
| POST | `/api/victims` | Add victim |
| PATCH | `/api/victims/:id/status` | Update victim status |
| GET | `/api/roads` | List roads |
| PATCH | `/api/roads/:id/status` | Block/open road |
| GET | `/api/routes?start=N1&end=N3` | Calculate route |
| GET | `/api/teams` | List rescue teams |
| POST | `/api/resources/allocate/:victimId` | Allocate a team |
| POST | `/api/orchestration/replan` | Recalculate rescue state |

## PostGIS + real Chennai datasets

This project is prepared for a real geospatial backend using PostGIS. The live app uses Chennai-oriented data through the JSON store and the database layer can accept a PostGIS connection when `USE_POSTGIS=true` and `POSTGIS_URI` is set.

### Environment variables

```env
USE_POSTGIS=true
POSTGIS_URI=postgresql://postgres:postgres@localhost:5432/resqnet
```

### PostGIS setup

1. Install PostgreSQL + PostGIS.
2. Create a database named `resqnet`.
3. Enable PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

4. Run the seed script in `src/data/postgis/chennai_seed.sql`.
5. Use the sample queries in `src/data/postgis/example_queries.sql` to test spatial logic.

### What the PostGIS dataset includes

- Chennai flood-risk and hotspot zones
- Victim locations across real Chennai areas
- Rescue team positions
- Hospitals and shelters
- Query examples for nearest-team assignment, risk overlap, and distance calculations

### Example real geospatial query

```sql
SELECT v.id, v.name, r.name AS nearest_team,
       ROUND(ST_Distance(v.geom::geography, r.geom::geography) / 1000, 2) AS km
FROM victims v
CROSS JOIN LATERAL (
  SELECT *
  FROM rescue_teams r
  ORDER BY v.geom <-> r.geom
  LIMIT 1
) r;
```

This is the correct pattern for a real Chennai emergency response backend because it uses spatial distance, overlap checks, and real city coordinates rather than placeholder values.

## Important Prototype Notes

- All people, coordinates, readings, and incidents are based on Chennai-oriented operational data.
- Risk thresholds and priority weights are illustrative.
- GPS distance is not the same as real travel time.
- The prototype is not suitable for real emergency deployment.
- Real deployment requires validated models, official data, safety review, security, and human oversight.

## Data State

The API modules share data through `src/store.js`, so road, victim, team, and sensor updates are visible across related endpoints during the current server session. Restarting the server restores the original JSON datasets.
