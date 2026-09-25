const MEDICAL_SCORES = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getMedicalScore(medicalNeed) {
  return MEDICAL_SCORES[medicalNeed] || 0;
}

function getVulnerabilityScore(age, groupSize) {
  let score = 30;

  if (age < 12 || age >= 65) score += 40;
  if (groupSize >= 4) score += 20;

  return clamp(score);
}

function calculateRescueScore(victim) {
  const medicalScore = getMedicalScore(victim.medicalNeed);
  const vulnerabilityScore = getVulnerabilityScore(
    Number(victim.age),
    Number(victim.groupSize)
  );

  const hazardScore = clamp(Number(victim.hazardSeverity));
  const timeScore = clamp((Number(victim.timeSinceContact) / 60) * 100);

  const rescueScore =
    0.4 * hazardScore +
    0.3 * medicalScore +
    0.2 * vulnerabilityScore +
    0.1 * timeScore;

  return {
    rescueScore: Math.round(rescueScore),
    breakdown: {
      hazardScore: Math.round(hazardScore),
      medicalScore,
      vulnerabilityScore,
      timeScore: Math.round(timeScore)
    }
  };
}

module.exports = {
  calculateRescueScore
};
