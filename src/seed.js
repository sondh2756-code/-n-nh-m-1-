import "dotenv/config";
import connectDB from "./config/db.js";
import Planet from "./models/Planet.js";
import dotenv from "dotenv";

dotenv.config();
// Cac hanh tinh can seed, kem ten tieng Viet va vai fun fact tay
// (API vat ly khong co san phan "fun facts" nen phan nay van viet thu cong)
const PLANETS_META = [
  {
    englishName: "Mercury",
    nameVi: "Sao Thuy",
    atmosphere: "Hau nhu khong co khi quyen",
    funFacts: [
      "Hanh tinh gan Mat Troi nhat trong He Mat Troi.",
      "Mot ngay tren Sao Thuy dai bang khoang 176 ngay Trai Dat.",
    ],
  },
  {
    englishName: "Venus",
    nameVi: "Sao Kim",
    atmosphere: "Chu yeu la CO2, day dac, gay hieu ung nha kinh manh",
    funFacts: [
      "Hanh tinh nong nhat He Mat Troi do hieu ung nha kinh.",
      "Sao Kim quay nguoc chieu so voi da so cac hanh tinh khac.",
    ],
  },
  {
    englishName: "Earth",
    nameVi: "Trai Dat",
    atmosphere: "78% Nito, 21% Oxy, con lai la cac khi khac",
    funFacts: [
      "Hanh tinh duy nhat duoc biet co su song.",
      "71% be mat duoc bao phu boi nuoc.",
    ],
  },
  {
    englishName: "Mars",
    nameVi: "Sao Hoa",
    atmosphere: "Chu yeu la CO2, mong va loang",
    funFacts: [
      "Con duoc goi la Hanh Tinh Do vi be mat giau oxit sat.",
      "Co ngon nui lua lon nhat He Mat Troi: Olympus Mons.",
    ],
  },
  {
    englishName: "Jupiter",
    nameVi: "Sao Moc",
    atmosphere: "Chu yeu la Hydro va Heli",
    funFacts: [
      "Hanh tinh lon nhat trong He Mat Troi.",
      "Co Vet Do Lon, mot con bao khong lo ton tai hang tram nam.",
    ],
  },
  {
    englishName: "Saturn",
    nameVi: "Sao Tho",
    atmosphere: "Chu yeu la Hydro va Heli",
    funFacts: [
      "Noi tieng voi he thong vanh dai bang bang va da.",
      "Co mat do thap den muc co the noi tren nuoc.",
    ],
  },
  {
    englishName: "Uranus",
    nameVi: "Sao Thien Vuong",
    atmosphere: "Hydro, Heli va Metan",
    funFacts: [
      "Quay nghieng gan 98 do, gan nhu 'lan' quanh Mat Troi.",
      "Mau xanh lam nhat den tu khi Metan trong khi quyen.",
    ],
  },
  {
    englishName: "Neptune",
    nameVi: "Sao Hai Vuong",
    atmosphere: "Hydro, Heli va Metan",
    funFacts: [
      "Hanh tinh xa nhat trong He Mat Troi.",
      "Co gio manh nhat He Mat Troi, len den 2,100 km/h.",
    ],
  },
];

const SOLAR_API = "https://api.le-systeme-solaire.net/rest/bodies/";
const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary/";

// Lay du lieu vat ly tat ca thien the tu Solar System OpenData API
const fetchPhysicalData = async () => {
  const apiKey = process.env.SOLAR_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Thieu SOLAR_API_KEY trong file .env. Tao key tai https://api.le-systeme-solaire.net/generatekey.html roi them vao .env: SOLAR_API_KEY=xxx",
    );
  }

  const res = await fetch(SOLAR_API, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) throw new Error(`Solar System API loi: ${res.status}`);
  const json = await res.json();
  return json.bodies;
};

// Lay anh dai dien tu Wikipedia REST API (co the null neu khong tim thay)
const fetchImageUrl = async (englishName) => {
  try {
    const res = await fetch(
      `${WIKI_API}${encodeURIComponent(englishName)}_(planet)`,
    );
    if (!res.ok) return "";
    const json = await res.json();
    return json.thumbnail?.source || json.originalimage?.source || "";
  } catch {
    return "";
  }
};

const buildPlanetDoc = (meta, allBodies, earthBody) => {
  const body = allBodies.find(
    (b) => b.englishName?.toLowerCase() === meta.englishName.toLowerCase(),
  );
  if (!body) {
    console.warn(`[Seed] Khong tim thay du lieu API cho ${meta.englishName}`);
    return null;
  }

  const diameterKm = body.meanRadius ? Math.round(body.meanRadius * 2) : null;
  const distSunMillionKm = body.semimajorAxis
    ? (body.semimajorAxis / 1_000_000).toFixed(1)
    : null;
  const distEarthMillionKm =
    body.semimajorAxis && earthBody?.semimajorAxis
      ? (
          Math.abs(body.semimajorAxis - earthBody.semimajorAxis) / 1_000_000
        ).toFixed(1)
      : null;
  const tempCelsius =
    typeof body.avgTemp === "number" && body.avgTemp > 0
      ? Math.round(body.avgTemp - 273.15)
      : null;
  const moonCount = Array.isArray(body.moons) ? body.moons.length : 0;
  const hasRing = Array.isArray(body.rings) && body.rings.length > 0;

  const funFacts = [...meta.funFacts];
  funFacts.push(
    moonCount > 0
      ? `Co ${moonCount} ve tinh tu nhien da duoc xac nhan.`
      : "Khong co ve tinh tu nhien.",
  );

  return {
    name: meta.nameVi,
    imageUrl: "", // se duoc gan sau khi fetch Wikipedia
    size: diameterKm
      ? `${diameterKm.toLocaleString("vi-VN")} km duong kinh`
      : "",
    atmosphere: meta.atmosphere,
    distanceFromEarth: distEarthMillionKm
      ? `~${distEarthMillionKm} trieu km (trung binh)`
      : "",
    distanceFromSun: distSunMillionKm ? `${distSunMillionKm} trieu km` : "",
    temperature: tempCelsius !== null ? `~${tempCelsius}°C (trung binh)` : "",
    hasRing,
    funFacts,
    _englishName: meta.englishName, // dung tam de fetch anh, se xoa truoc khi luu
  };
};

const seed = async () => {
  try {
    await connectDB();

    console.log("[Seed] Dang lay du lieu tu Solar System OpenData API...");
    const allBodies = await fetchPhysicalData();
    const earthBody = allBodies.find((b) => b.englishName === "Earth");

    const docs = PLANETS_META.map((meta) =>
      buildPlanetDoc(meta, allBodies, earthBody),
    ).filter(Boolean);

    console.log("[Seed] Dang lay anh tu Wikipedia...");
    for (const doc of docs) {
      doc.imageUrl = await fetchImageUrl(doc._englishName);
      delete doc._englishName;
    }

    await Planet.deleteMany({});
    await Planet.insertMany(docs);

    console.log(`[Seed] Da them ${docs.length} hanh tinh vao database.`);
    process.exit(0);
  } catch (err) {
    console.error("[Seed] Loi khi seed du lieu:", err);
    process.exit(1);
  }
};

seed();
