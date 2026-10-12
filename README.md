# ResQNet

ResQNet is a disaster-response coordination platform designed for emergency scenarios such as floods, landslides, and earthquakes. It combines a real-time frontend interface with a backend orchestration service to help users monitor risk, identify hazards, route safe pathways, and coordinate rescue actions.

The project is structured as a modern full-stack application with:

- A React + Vite frontend for the citizen and responder experience
- A Node.js + Express backend for APIs, coordination logic, and live event streaming
- Simulation-ready data for disaster events, road conditions, victims, sensors, and rescue teams

## Overview

ResQNet supports a disaster-response workflow that includes:

- live risk and alert monitoring
- emergency SOS flow
- safe route guidance
- incident reporting
- victim prioritization and resource allocation
- real-time orchestration and fallback planning

This project is intended as a prototype for adaptive emergency management and can be extended for real deployments with validated geospatial data, live telemetry, and production-grade infrastructure.

## Key Features

- Real-time dashboard for disaster overview and emergency status
- Map-based risk visualization and route recommendations
- SOS experience for urgent citizen assistance
- Incident reporting and severity tracking
- Victim prioritization and rescue allocation logic
- Road blockage simulation and rerouting
- Sensor and disaster data APIs
- WebSocket support for live updates
- PostGIS-ready architecture for spatial analysis

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Leaflet / map components
- Socket.IO client

### Backend
- Node.js
- Express.js
- PostgreSQL / PostGIS ready integration
- MongoDB-ready optional configuration
- Socket.IO
- Mongoose / pg drivers

## Project Structure

```text
resqnet-backend/
├── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── resqnet-backend/
│   ├── src/
│   ├── database/
│   ├── package.json
│   └── README.md
└── .git/
```

## Local Development

### 1. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd resqnet-backend
npm install
```

### 2. Run the backend

```bash
cd resqnet-backend
npm start
```

Default backend URL:

```text
http://localhost:5000
```

### 3. Run the frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

Default frontend URL:

```text
http://localhost:5173
```

## Environment Configuration

The backend can operate with local dataset-driven behavior or connect to external systems such as MongoDB or PostGIS. Configure environment variables based on the deployment setup you want to use.

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
USE_MONGODB=false
USE_POSTGIS=false
```

For PostGIS-based deployments:

```env
USE_POSTGIS=true
POSTGIS_URI=postgresql://postgres:postgres@localhost:5432/resqnet
```

## System Workflow

1. The frontend loads the live app and presents disaster information and safe-route actions.
2. The backend exposes APIs for disasters, sensors, victims, risk, resources, and routing.
3. Business rules evaluate priority, safety, and road conditions.
4. Rescue teams and resources are allocated based on urgency and accessibility.
5. Events are pushed through Socket.IO for near real-time updates.

## API Highlights

Key endpoints exposed by the backend include:

- `/api/health` — service health check
- `/api/disasters` — disaster records
- `/api/sensors` — live sensor data
- `/api/risk` — risk computations
- `/api/victims` — victim data and prioritization
- `/api/roads` — road conditions and blockage states
- `/api/routes` — safe route calculations
- `/api/teams` — rescue team data
- `/api/resources` — allocation logic
- `/api/orchestration` — rescue re-planning and orchestration

## Use Cases

ResQNet is well suited for:

- disaster awareness and civic safety dashboards
- emergency response simulation and planning
- route optimization under hazard conditions
- victim prioritization for rescue operations
- rapid decision support for coordinated response teams

## Current Status

This project is a functional prototype demonstrating the core emergency response workflow, with room for future enhancement in production-grade monitoring, analytics, authentication, and real-world deployment integration.

## License

This project is currently provided for educational and prototype use. Please review the repository ownership and licensing terms before commercial deployment or public release.

## Contributors

This project was developed as an adaptive emergency response system prototype for disaster coordination and intelligent rescue planning.
