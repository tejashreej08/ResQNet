-- 1) Find all victims in high-risk Chennai zones
SELECT v.id, v.name, rz.name AS risk_zone, rz.severity
FROM victims v
JOIN risk_zones rz
  ON ST_Contains(rz.geom, v.geom)
ORDER BY v.rescue_score DESC;

-- 2) Find nearest rescue team for each victim
SELECT v.id, v.name, r.name AS nearest_team,
       ROUND(ST_Distance(v.geom::geography, r.geom::geography) / 1000, 2) AS km_away
FROM victims v
CROSS JOIN LATERAL (
    SELECT *
    FROM rescue_teams r
    ORDER BY v.geom <-> r.geom
    LIMIT 1
) r;

-- 3) Find all victims within 2 km of a hospital
SELECT v.id, v.name, h.name AS hospital_name,
       ROUND(ST_Distance(v.geom::geography, h.geom::geography) / 1000, 2) AS distance_km
FROM victims v
JOIN hospitals h
  ON ST_DWithin(v.geom::geography, h.geom::geography, 2000)
ORDER BY distance_km;

-- 4) Find shelters with capacity near high-priority victims
SELECT v.id, v.name, v.rescue_score, s.name AS shelter_name,
       ROUND(ST_Distance(v.geom::geography, s.geom::geography) / 1000, 2) AS distance_km
FROM victims v
JOIN shelters s
  ON ST_DWithin(v.geom::geography, s.geom::geography, 5000)
WHERE v.rescue_score >= 60
ORDER BY v.rescue_score DESC;

-- 5) Count victims by risk severity
SELECT rz.severity, COUNT(v.id) AS victim_count
FROM risk_zones rz
LEFT JOIN victims v
  ON ST_Contains(rz.geom, v.geom)
GROUP BY rz.severity
ORDER BY victim_count DESC;
