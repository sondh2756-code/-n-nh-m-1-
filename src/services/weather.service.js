// Dung native fetch (co san tu Node.js 18+), khong can cai them thu vien

// Lay du lieu thoi tiet (do che phu may) tu OpenWeatherMap - chuc nang 3
export async function getCloudCover(lat, lng) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error("Khong lay duoc du lieu thoi tiet");
    err.status = 502;
    throw err;
  }

  const data = await res.json();
  return {
    cloudCoverPercent: data.clouds?.all ?? null,
    temperature: data.main?.temp ?? null,
    description: data.weather?.[0]?.description ?? "",
  };
}

// Tinh diem "kha nang ngam sao" don gian dua tren % may che phu
export function computeStargazingScore(cloudCoverPercent) {
  if (cloudCoverPercent === null) return null;
  const score = Math.max(0, 100 - cloudCoverPercent);
  return Math.round(score);
}
