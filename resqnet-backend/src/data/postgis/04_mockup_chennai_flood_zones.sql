-- Chennai flood-prone localities from the mockup GeoJSON export.
-- This script matches the app's risk_zones schema so the backend can read it directly.

CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS risk_zones;

CREATE TABLE risk_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  exposure_pct INTEGER,
  note TEXT,
  geom GEOMETRY(POINT, 4326) NOT NULL
);

INSERT INTO risk_zones (name, severity, exposure_pct, note, geom)
VALUES
  ('Semmancheri', 'Critical', 83, NULL, ST_GeomFromText('POINT(80.2265 12.8406)', 4326)),
  ('Saidapet', 'Critical', 74, NULL, ST_GeomFromText('POINT(80.2209 13.0210)', 4326)),
  ('Sholinganallur', 'Critical', 74, NULL, ST_GeomFromText('POINT(80.2279 12.9010)', 4326)),
  ('Siruseri', 'Critical', 60, NULL, ST_GeomFromText('POINT(80.2270 12.8230)', 4326)),
  ('Karapakkam', 'Critical', 59, NULL, ST_GeomFromText('POINT(80.2350 12.9280)', 4326)),
  ('T. Nagar', 'Critical', 56, NULL, ST_GeomFromText('POINT(80.2341 13.0418)', 4326)),
  ('Manali', 'Critical', 51, NULL, ST_GeomFromText('POINT(80.2660 13.1670)', 4326)),
  ('Egmore', 'Critical', NULL, 'NCCR Red Atlas adjacent (Periamet/Chintadripet)', ST_GeomFromText('POINT(80.2609 13.0732)', 4326)),
  ('Thoraipakkam', 'High', 47, NULL, ST_GeomFromText('POINT(80.2370 12.9410)', 4326)),
  ('Guindy', 'High', 48, NULL, ST_GeomFromText('POINT(80.2206 13.0067)', 4326)),
  ('Pallavaram', 'High', 49, NULL, ST_GeomFromText('POINT(80.1491 12.9675)', 4326)),
  ('Pallikaranai', 'High', 44, NULL, ST_GeomFromText('POINT(80.2170 12.9400)', 4326)),
  ('Ennore', 'High', 39, NULL, ST_GeomFromText('POINT(80.3230 13.2146)', 4326)),
  ('Vyasarpadi', 'High', 35, NULL, ST_GeomFromText('POINT(80.2530 13.1180)', 4326)),
  ('Chromepet', 'High', 34, NULL, ST_GeomFromText('POINT(80.1462 12.9516)', 4326)),
  ('Mudichur', 'High', NULL, 'Fire & Rescue Services flood-prone list', ST_GeomFromText('POINT(80.1180 12.9080)', 4326)),
  ('Adyar', 'High', NULL, 'Fire & Rescue Services flood-prone list', ST_GeomFromText('POINT(80.2565 13.0012)', 4326)),
  ('Perungudi', 'High', NULL, 'Fire & Rescue Services flood-prone list', ST_GeomFromText('POINT(80.2420 12.9650)', 4326)),
  ('Velachery', 'Moderate', 37, NULL, ST_GeomFromText('POINT(80.2207 12.9756)', 4326)),
  ('Tondiarpet', 'Moderate', 26, NULL, ST_GeomFromText('POINT(80.2870 13.1220)', 4326)),
  ('Porur', 'Moderate', 31, NULL, ST_GeomFromText('POINT(80.1575 13.0374)', 4326)),
  ('Tambaram', 'Moderate', 33, NULL, ST_GeomFromText('POINT(80.1000 12.9249)', 4326)),
  ('Alwarpet', 'Moderate', NULL, 'Unusually flooded Nov rains, historically low-risk', ST_GeomFromText('POINT(80.2540 13.0340)', 4326)),
  ('Madhavaram', 'Moderate', 16, NULL, ST_GeomFromText('POINT(80.2320 13.1470)', 4326)),
  ('Washermanpet', 'Moderate', 19, NULL, ST_GeomFromText('POINT(80.2870 13.1150)', 4326)),
  ('Alandur', 'Moderate', NULL, 'Fire & Rescue Services flood-prone list', ST_GeomFromText('POINT(80.2010 13.0033)', 4326)),
  ('Valasaravakkam', 'Moderate', NULL, 'Fire & Rescue Services flood-prone list', ST_GeomFromText('POINT(80.1780 13.0430)', 4326)),
  ('Koyambedu', 'Moderate', NULL, 'Unusually flooded Nov rains', ST_GeomFromText('POINT(80.1950 13.0700)', 4326));
