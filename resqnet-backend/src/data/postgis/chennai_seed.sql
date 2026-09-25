CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS shelters CASCADE;
DROP TABLE IF EXISTS victims CASCADE;
DROP TABLE IF EXISTS rescue_teams CASCADE;
DROP TABLE IF EXISTS roads CASCADE;
DROP TABLE IF EXISTS risk_zones CASCADE;

CREATE TABLE risk_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    geom GEOMETRY(POLYGON, 4326) NOT NULL
);

CREATE TABLE victims (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    group_size INTEGER NOT NULL DEFAULT 1,
    has_medical_need BOOLEAN NOT NULL DEFAULT false,
    geom GEOMETRY(POINT, 4326) NOT NULL,
    rescue_score INTEGER DEFAULT 0
);

CREATE TABLE roads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    from_node VARCHAR(20) NOT NULL DEFAULT 'N1',
    to_node VARCHAR(20) NOT NULL DEFAULT 'N2',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    distance NUMERIC(8,2) NOT NULL DEFAULT 1.00,
    geom GEOMETRY(LINESTRING, 4326) NOT NULL
);

CREATE TABLE rescue_teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team_type VARCHAR(50) NOT NULL,
    geom GEOMETRY(POINT, 4326) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    geom GEOMETRY(POINT, 4326) NOT NULL
);

CREATE TABLE shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    geom GEOMETRY(POINT, 4326) NOT NULL
);

INSERT INTO risk_zones (name, severity, geom)
VALUES
    (
        'Flood Zone - T Nagar',
        'High',
        ST_GeomFromText('POLYGON((80.2200 13.0400, 80.2400 13.0400, 80.2400 13.0600, 80.2200 13.0600, 80.2200 13.0400))', 4326)
    ),
    (
        'Flood Zone - Adyar',
        'Critical',
        ST_GeomFromText('POLYGON((80.2400 12.9900, 80.2700 12.9900, 80.2700 13.0250, 80.2400 13.0250, 80.2400 12.9900))', 4326)
    ),
    (
        'Flood Zone - Velachery',
        'Moderate',
        ST_GeomFromText('POLYGON((80.1800 12.9500, 80.2200 12.9500, 80.2200 12.9900, 80.1800 12.9900, 80.1800 12.9500))', 4326)
    );

INSERT INTO roads (name, from_node, to_node, status, distance, geom)
VALUES
    ('T Nagar - Adyar', 'N1', 'N2', 'open', 3.40, ST_GeomFromText('LINESTRING(80.2200 13.0400, 80.2400 13.0200)', 4326)),
    ('Guindy - Velachery', 'N2', 'N3', 'open', 4.10, ST_GeomFromText('LINESTRING(80.2200 13.0100, 80.2000 12.9800)', 4326)),
    ('Anna Nagar - Tambaram', 'N3', 'N4', 'open', 6.80, ST_GeomFromText('LINESTRING(80.2100 13.0900, 80.1400 12.9300)', 4326));

INSERT INTO victims (name, group_size, has_medical_need, geom, rescue_score)
VALUES
    ('Victim A - T Nagar', 4, true, ST_GeomFromText('POINT(80.2290 13.0490)', 4326), 90),
    ('Victim B - Adyar', 2, false, ST_GeomFromText('POINT(80.2530 13.0050)', 4326), 55),
    ('Victim C - Guindy', 6, true, ST_GeomFromText('POINT(80.2205 13.0125)', 4326), 100),
    ('Victim D - Velachery', 1, false, ST_GeomFromText('POINT(80.1980 12.9750)', 4326), 35),
    ('Victim E - Anna Nagar', 3, true, ST_GeomFromText('POINT(80.2090 13.0890)', 4326), 68),
    ('Victim F - Tambaram', 5, false, ST_GeomFromText('POINT(80.1240 12.9230)', 4326), 60);

INSERT INTO rescue_teams (name, team_type, geom, is_available)
VALUES
    ('Ambulance 1', 'ambulance', ST_GeomFromText('POINT(80.2310 13.0550)', 4326), true),
    ('Boat Team A', 'boat', ST_GeomFromText('POINT(80.2580 13.0080)', 4326), true),
    ('Ground Team 3', 'ground_team', ST_GeomFromText('POINT(80.2000 12.9800)', 4326), true),
    ('Medical Team 2', 'medical', ST_GeomFromText('POINT(80.2110 13.0830)', 4326), true),
    ('Disaster Relief Base', 'relief', ST_GeomFromText('POINT(80.1480 12.9350)', 4326), true);

INSERT INTO hospitals (name, capacity, geom)
VALUES
    ('Apollo Hospital Chennai', 200, ST_GeomFromText('POINT(80.2120 13.0610)', 4326)),
    ('Malar Hospital', 120, ST_GeomFromText('POINT(80.2450 12.9900)', 4326)),
    ('Fortis Malar', 150, ST_GeomFromText('POINT(80.2000 13.0300)', 4326));

INSERT INTO shelters (name, capacity, geom)
VALUES
    ('T Nagar Community Shelter', 80, ST_GeomFromText('POINT(80.2320 13.0470)', 4326)),
    ('Adyar Relief Shelter', 120, ST_GeomFromText('POINT(80.2500 13.0020)', 4326)),
    ('Velachery Safe Hall', 90, ST_GeomFromText('POINT(80.2050 12.9700)', 4326));

UPDATE victims v
SET rescue_score = (
    (v.group_size * 10) +
    (CASE WHEN v.has_medical_need THEN 30 ELSE 0 END) +
    COALESCE((
        SELECT MAX(
            CASE rz.severity
                WHEN 'Critical' THEN 40
                WHEN 'High' THEN 25
                WHEN 'Moderate' THEN 10
                ELSE 0
            END
        )
        FROM risk_zones rz
        WHERE ST_Contains(rz.geom, v.geom)
    ), 0)
);

SELECT id, name, group_size, has_medical_need, rescue_score
FROM victims
ORDER BY rescue_score DESC;
