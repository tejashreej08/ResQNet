# Optional MongoDB Models

The current MVP uses JSON files and in-memory arrays.

When migrating to MongoDB, create Mongoose schemas for:

- Disaster
- Sensor
- Victim
- Road
- RescueTeam

Do not mix JSON state and database state in production. Choose one source of truth and implement persistence consistently.
