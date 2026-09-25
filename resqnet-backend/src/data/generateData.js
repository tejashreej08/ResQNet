const fs = require("fs");
const path = require("path");

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateVictims(count = 20) {
  const medicalNeeds = ["critical", "high", "medium", "low"];

  return Array.from({ length: count }, (_, index) => ({
    id: `V${String(index + 1).padStart(3, "0")}`,
    name: `Chennai Victim ${index + 1}`,
    location: {
      node: randomChoice(["N3", "N5", "N6"]),
      lat: Number(randomBetween(12.90, 12.95).toFixed(6)),
      lng: Number(randomBetween(80.08, 80.13).toFixed(6))
    },
    age: Math.floor(randomBetween(1, 90)),
    medicalNeed: randomChoice(medicalNeeds),
    groupSize: Math.floor(randomBetween(1, 6)),
    hazardSeverity: Math.floor(randomBetween(0, 101)),
    timeSinceContact: Math.floor(randomBetween(0, 121)),
    status: "waiting",
    disasterId: "DIS001"
  }));
}

const outputPath = path.join(__dirname, "generatedVictims.json");

fs.writeFileSync(
  outputPath,
  JSON.stringify(generateVictims(20), null, 2)
);

console.log(`Generated real Chennai dataset at ${outputPath}`);

