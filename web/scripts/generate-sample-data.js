const fs = require("fs");
const path = require("path");

const CITIES = ["Ahmedabad", "Delhi", "Mumbai", "Kolkata", "Chennai", "Hyderabad", "Bangalore"];
const AQI_BUCKETS = ["Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"];
// AQI ranges: Good 0-50, Satisfactory 51-100, Moderate 101-200, Poor 201-300, Very Poor 301-400, Severe 401+
const BUCKET_RANGES = [[0, 50], [51, 100], [101, 200], [201, 300], [301, 400], [401, 500]];

function randomInRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function getDateStr(dayOffset) {
  const d = new Date(2019, 0, 1);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().slice(0, 10);
}

const data = [];
for (let dayOffset = 0; dayOffset < 200; dayOffset++) {
  const date = getDateStr(dayOffset);
  for (const city of CITIES) {
    const bucketIdx = Math.min(5, Math.floor(Math.random() * 4) + Math.floor(dayOffset / 80));
    const [aqiMin, aqiMax] = BUCKET_RANGES[bucketIdx];
    const AQI = randomInRange(aqiMin, Math.min(aqiMax, aqiMin + 40));
    const AQI_Bucket = AQI_BUCKETS[bucketIdx];
    data.push({
      City: city,
      Date: date,
      "PM2.5": randomInRange(10, 200),
      PM10: randomInRange(20, 300),
      NO: Math.round((Math.random() * 50) * 100) / 100,
      NO2: Math.round((Math.random() * 80) * 100) / 100,
      CO: Math.round((Math.random() * 3) * 100) / 100,
      SO2: randomInRange(5, 80),
      O3: randomInRange(20, 120),
      AQI: AQI,
      AQI_Bucket: AQI_Bucket,
    });
  }
}

const outDir = path.join(__dirname, "..", "public", "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "city_day_sample.json"), JSON.stringify(data, null, 0));

const cities = [...new Set(data.map((r) => r.City))].sort();
fs.writeFileSync(path.join(outDir, "cities.json"), JSON.stringify(cities));

console.log("Generated", data.length, "rows and", cities.length, "cities.");
