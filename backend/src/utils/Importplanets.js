// Import du lieu thien the (hanh tinh, hanh tinh lun, ve tinh, mat troi,
// sao va ho den) vao MongoDB.
// - Hanh tinh / hanh tinh lun / ve tinh / Mat Troi: lay THAT tu Solar System
//   OpenData API (chi co du lieu he Mat Troi).
// - Sao va ho den ngoai he Mat Troi: API tren KHONG co du lieu nay, nen duoc
//   liet ke "tinh" (hardcode) ben duoi voi so lieu gan dung pho bien. Ban nen
//   kiem tra lai truoc khi dung cho muc dich can do chinh xac cao.
//
// Chay: node src/utils/importPlanets.js
// Can co SOLAR_SYSTEM_API_KEY trong .env (lay mien phi tai:
// https://api.le-systeme-solaire.net/generatekey.html)

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Planet from "../models/Planet.js";
import { generatePlanetFunFacts } from "../services/gemini.service.js";

// Lay TOAN BO body cua he Mat Troi (khong loc isPlanet nua), roi tu loc
// theo bodyType o phia client vi API khong ho tro loc bodyType in [...]
const API_URL = "https://api.le-systeme-solaire.net/rest/bodies/";

// Anh minh hoa cho 8 hanh tinh chinh (API khong co san imageUrl)
// Nguon: NASA (public domain) - co the thay bang anh khac neu muon
const PLANET_IMAGES = {
  Mercury:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/15_mercury_1600x900.jpg",
  Venus:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/16_venus_1600x900.jpg",
  Earth:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/17_earth_1600x900.jpg",
  Mars: "https://solarsystem.nasa.gov/system/stellar_items/image_files/1_mars_1600x900.jpg",
  Jupiter:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/18_jupiter_1600x900.jpg",
  Saturn:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/19_saturn_1600x900.jpg",
  Uranus:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/20_uranus_1600x900.jpg",
  Neptune:
    "https://solarsystem.nasa.gov/system/stellar_items/image_files/21_neptune_1600x900.jpg",
};

// Danh sach hanh tinh lun se lay tu API (bodyType === "Dwarf Planet")
// va gioi han so luong lay ve
const MAX_DWARF_PLANETS = 10;

// Danh sach ve tinh lon/noi tieng se duoc giu lai (API tra ve hang tram ve
// tinh nho khong ten, khong can import het)
const MAJOR_MOONS = new Set([
  "Moon",
  "Phobos",
  "Deimos",
  "Io",
  "Europa",
  "Ganymede",
  "Callisto",
  "Titan",
  "Enceladus",
  "Mimas",
  "Rhea",
  "Iapetus",
  "Dione",
  "Tethys",
  "Titania",
  "Oberon",
  "Miranda",
  "Ariel",
  "Umbriel",
  "Triton",
  "Charon",
]);

// ---------------------------------------------------------------------
// DANH SACH SAO (khong tinh Mat Troi) - so lieu gan dung, don vi nam anh
// sang (ly = light-year) va nhiet do be mat (K)
// ---------------------------------------------------------------------
const STARS = [
  {
    name: "Sirius",
    distanceLy: 8.6,
    tempK: 9940,
    note: "Ngoi sao sang nhat bau troi dem, sao doi voi Sirius B la sao lun trang.",
  },
  {
    name: "Proxima Centauri",
    distanceLy: 4.24,
    tempK: 3042,
    note: "Ngoi sao gan Mat Troi nhat, thuoc he ba sao Alpha Centauri.",
  },
  {
    name: "Alpha Centauri A",
    distanceLy: 4.37,
    tempK: 5790,
    note: "Thanh phan chinh cua he sao gan Trai Dat nhat.",
  },
  {
    name: "Alpha Centauri B",
    distanceLy: 4.37,
    tempK: 5260,
    note: "Sao doi voi Alpha Centauri A.",
  },
  {
    name: "Barnard's Star",
    distanceLy: 5.96,
    tempK: 3134,
    note: "Sao lun do co chuyen dong rieng nhanh nhat tren bau troi.",
  },
  {
    name: "Wolf 359",
    distanceLy: 7.86,
    tempK: 2800,
    note: "Mot trong nhung sao gan nhat, kha mo nhat.",
  },
  {
    name: "Sirius B",
    distanceLy: 8.6,
    tempK: 25000,
    note: "Sao lun trang dong hanh cua Sirius A.",
  },
  {
    name: "Epsilon Eridani",
    distanceLy: 10.5,
    tempK: 5084,
    note: "Sao tre, co dia dia hanh tinh dang duoc nghien cuu.",
  },
  {
    name: "Tau Ceti",
    distanceLy: 11.9,
    tempK: 5344,
    note: "Sao giong Mat Troi, co nhieu ung vien hanh tinh.",
  },
  {
    name: "Altair",
    distanceLy: 16.7,
    tempK: 7670,
    note: "Mot trong ba dinh cua Tam giac Mua He, quay rat nhanh.",
  },
  {
    name: "Vega",
    distanceLy: 25,
    tempK: 9600,
    note: "Tung la sao Bac Cuc cach day khoang 12.000 nam.",
  },
  {
    name: "Fomalhaut",
    distanceLy: 25,
    tempK: 8590,
    note: "Co dia bui bao quanh, tung chup duoc anh truc tiep 1 ngoai hanh tinh.",
  },
  {
    name: "Pollux",
    distanceLy: 34,
    tempK: 4666,
    note: "Sao khong lo cam, sang nhat chom sao Song Tu.",
  },
  {
    name: "Capella",
    distanceLy: 43,
    tempK: 4970,
    note: "He 4 sao, sao sang thu 6 tren bau troi dem.",
  },
  {
    name: "Arcturus",
    distanceLy: 37,
    tempK: 4286,
    note: "Sao khong lo do sang, sang nhat ban cau bac.",
  },
  {
    name: "Aldebaran",
    distanceLy: 65,
    tempK: 3900,
    note: "Sao khong lo do, 'mat bo' trong chom sao Kim Nguu.",
  },
  {
    name: "Regulus",
    distanceLy: 79,
    tempK: 12460,
    note: "Sao quay cuc nhanh, gan nhu bi bep o hai cuc.",
  },
  {
    name: "Spica",
    distanceLy: 250,
    tempK: 22400,
    note: "He sao doi rat sang trong chom sao Xu Nu.",
  },
  {
    name: "Antares",
    distanceLy: 550,
    tempK: 3660,
    note: "Sao sieu khong lo do, kich thuoc gap hang tram lan Mat Troi.",
  },
  {
    name: "Betelgeuse",
    distanceLy: 640,
    tempK: 3600,
    note: "Sao sieu khong lo do sap ket thuc vong doi, co the no sieu tan tinh.",
  },
  {
    name: "Rigel",
    distanceLy: 860,
    tempK: 12100,
    note: "Sao sieu khong lo xanh, sang nhat chom sao Lap Ho.",
  },
  {
    name: "Deneb",
    distanceLy: 2600,
    tempK: 8525,
    note: "Mot dinh Tam giac Mua He, cuc ky sang du rat xa.",
  },
  {
    name: "Canopus",
    distanceLy: 310,
    tempK: 7350,
    note: "Sao sang thu hai tren bau troi dem sau Sirius.",
  },
  {
    name: "Polaris",
    distanceLy: 433,
    tempK: 6015,
    note: "Sao Bac Cuc hien tai, gan nhu dung yen tren bau troi bac.",
  },
  {
    name: "Mira",
    distanceLy: 300,
    tempK: 3000,
    note: "Sao bien quang dien hinh, do sang thay doi ro ret theo chu ky.",
  },
  {
    name: "Achernar",
    distanceLy: 139,
    tempK: 14000,
    note: "Sao dep nhat, bi bep manh do quay cuc nhanh.",
  },
  {
    name: "Bellatrix",
    distanceLy: 250,
    tempK: 22000,
    note: "'Sao Nu Chien Binh' o vai chom sao Lap Ho.",
  },
  {
    name: "Mizar",
    distanceLy: 83,
    tempK: 9000,
    note: "Sao doi noi tieng trong chuoi Bac Dau, de quan sat bang mat thuong.",
  },
  {
    name: "Alcor",
    distanceLy: 82,
    tempK: 8000,
    note: "Sao dong hanh quang hoc cua Mizar.",
  },
  {
    name: "61 Cygni",
    distanceLy: 11.4,
    tempK: 4526,
    note: "Sao dau tien do duoc khoang cach bang thi sai (nam 1838).",
  },
  {
    name: "Kapteyn's Star",
    distanceLy: 12.8,
    tempK: 3550,
    note: "Sao lun do co van toc rat cao, co the tu mot thien ha lun bi nuot chung.",
  },
  {
    name: "Luyten's Star",
    distanceLy: 12.4,
    tempK: 3151,
    note: "Sao lun do gan he Procyon.",
  },
  {
    name: "Procyon",
    distanceLy: 11.5,
    tempK: 6530,
    note: "Sao sang thu 8 tren bau troi, co ban dong hanh la sao lun trang.",
  },
  {
    name: "Gliese 581",
    distanceLy: 20.4,
    tempK: 3498,
    note: "He sao noi tieng vi co nhieu hanh tinh trong vung o duoc.",
  },
  {
    name: "TRAPPIST-1",
    distanceLy: 40.7,
    tempK: 2566,
    note: "Sao lun sieu lanh co 7 hanh tinh co kich thuoc gan Trai Dat.",
  },
];

// ---------------------------------------------------------------------
// DANH SACH HO DEN NOI TIENG - so lieu gan dung tu cac nghien cuu cong bo
// ---------------------------------------------------------------------
const BLACK_HOLES = [
  {
    name: "Sagittarius A*",
    distanceLy: 26000,
    massSolar: "~4.3 trieu lan Mat Troi",
    note: "Ho den sieu khoi luong o trung tam thien ha Ngan Ha.",
  },
  {
    name: "M87*",
    distanceLy: 53000000,
    massSolar: "~6.5 ty lan Mat Troi",
    note: "Ho den dau tien duoc chup anh truc tiep (2019, Event Horizon Telescope).",
  },
  {
    name: "Cygnus X-1",
    distanceLy: 7200,
    massSolar: "~21 lan Mat Troi",
    note: "Ho den khoi luong sao dau tien duoc xac nhan, trong he sao doi.",
  },
  {
    name: "TON 618",
    distanceLy: 10400000000,
    massSolar: "~66 ty lan Mat Troi",
    note: "Mot trong nhung ho den lon nhat tung duoc biet den.",
  },
  {
    name: "V404 Cygni",
    distanceLy: 7800,
    massSolar: "~9 lan Mat Troi",
    note: "He sao doi co ho den, tung bung phat tia X manh.",
  },
  {
    name: "GRO J1655-40",
    distanceLy: 11000,
    massSolar: "~6.3 lan Mat Troi",
    note: "He sao doi tia X voi ho den, con goi la 'Nova Scorpii 1994'.",
  },
  {
    name: "A0620-00",
    distanceLy: 3500,
    massSolar: "~6.6 lan Mat Troi",
    note: "Mot trong nhung ung vien ho den dau tien duoc phat hien.",
  },
  {
    name: "GRS 1915+105",
    distanceLy: 36000,
    massSolar: "~12 lan Mat Troi",
    note: "Tung duoc xem la ho den khoi luong sao lon nhat trong Ngan Ha.",
  },
  {
    name: "XTE J1550-564",
    distanceLy: 17000,
    massSolar: "~9.1 lan Mat Troi",
    note: "He sao doi tia X voi tia vat chat (jet) toc do cao.",
  },
  {
    name: "LMC X-1",
    distanceLy: 163000,
    massSolar: "~11 lan Mat Troi",
    note: "Ho den trong thien ha lan can Dai Magellan.",
  },
  {
    name: "LMC X-3",
    distanceLy: 163000,
    massSolar: "~7 lan Mat Troi",
    note: "Mot ho den khac trong Dai Magellan.",
  },
  {
    name: "M33 X-7",
    distanceLy: 3000000,
    massSolar: "~15.7 lan Mat Troi",
    note: "Ho den nam trong he sao doi thien thuc, nam trong thien ha M33.",
  },
  {
    name: "IC 10 X-1",
    distanceLy: 2200000,
    massSolar: "~23-34 lan Mat Troi",
    note: "Mot trong nhung ho den khoi luong sao lon nhat duoc biet den.",
  },
  {
    name: "NGC 6240 (doi ho den)",
    distanceLy: 400000000,
    massSolar: "hang tram trieu lan Mat Troi (moi cai)",
    note: "Thien ha chua mot cap ho den sieu khoi luong dang tien lai gan nhau.",
  },
  {
    name: "OJ 287 (ho den trung tam)",
    distanceLy: 3500000000,
    massSolar: "~18 ty lan Mat Troi",
    note: "He chuan tinh voi ho den doi, phat sang theo chu ky de du doan.",
  },
];

// API tra ve khoang cach tinh bang km (semimajorAxis) - format lai cho de doc
function formatDistance(km) {
  if (!km) return "N/A";
  const millionKm = km / 1_000_000;
  if (millionKm >= 1000) {
    return `${(millionKm / 1000).toFixed(2)} ty km`;
  }
  return `${millionKm.toFixed(1)} trieu km`;
}

// avgTemp tra ve don vi Kelvin - doi sang Celsius
function kelvinToCelsius(kelvin) {
  if (!kelvin) return "N/A";
  return `${Math.round(kelvin - 273.15)} °C`;
}

function formatSize(meanRadiusKm) {
  if (!meanRadiusKm) return "N/A";
  const diameter = Math.round(meanRadiusKm * 2);
  return `Duong kinh ~${diameter.toLocaleString("vi-VN")} km`;
}

// Format khoang cach nam anh sang, tu dong doi sang ty nam anh sang neu qua lon
function formatLightYears(ly) {
  if (!ly) return "N/A";
  if (ly >= 1_000_000_000) {
    return `${(ly / 1_000_000_000).toFixed(2)} ty nam anh sang`;
  }
  if (ly >= 1_000_000) {
    return `${(ly / 1_000_000).toFixed(1)} trieu nam anh sang`;
  }
  return `${ly.toLocaleString("vi-VN")} nam anh sang`;
}

// Sinh fun facts va luu 1 document vao DB, dung chung cho moi loai thien the
async function upsertBody(planetData, counters) {
  console.log(`[Import] Dang xu ly: ${planetData.name}...`);

  try {
    planetData.funFacts = await generatePlanetFunFacts(planetData.name);
  } catch (err) {
    console.warn(
      `  -> Khong sinh duoc fun facts cho ${planetData.name}: ${err.message}`,
    );
    planetData.funFacts = [];
  }

  const result = await Planet.findOneAndUpdate(
    { name: planetData.name },
    { $set: planetData },
    { upsert: true, new: true, rawResult: true },
  );

  if (result.lastErrorObject?.updatedExisting) {
    counters.updated++;
  } else {
    counters.created++;
  }
}

async function importPlanets() {
  await connectDB();

  const apiKey = process.env.SOLAR_SYSTEM_API_KEY;
  if (!apiKey) {
    console.error("[Loi] Thieu SOLAR_SYSTEM_API_KEY trong .env");
    console.error(
      "Lay key mien phi tai: https://api.le-systeme-solaire.net/generatekey.html",
    );
    process.exit(1);
  }

  console.log("[Import] Dang goi Solar System OpenData API...");
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    console.error(`[Loi] API tra ve status ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  const data = await res.json();
  const bodies = data.bodies || [];
  console.log(`[Import] Tim thay ${bodies.length} thien the tu API`);

  const counters = { created: 0, updated: 0 };

  // 1. 8 hanh tinh chinh
  const planets = bodies.filter((b) => b.isPlanet === true);

  // 2. Hanh tinh lun (Pluto, Ceres, Eris, Haumea, Makemake, ...)
  const dwarfPlanets = bodies
    .filter((b) => b.bodyType === "Dwarf Planet")
    .slice(0, MAX_DWARF_PLANETS);

  // 3. Mat Troi
  const sun = bodies.filter((b) => b.bodyType === "Star");

  // 4. Ve tinh lon/noi tieng
  const moons = bodies.filter(
    (b) => b.bodyType === "Moon" && MAJOR_MOONS.has(b.englishName || b.name),
  );

  const solarSystemBodies = [...planets, ...dwarfPlanets, ...sun, ...moons];
  console.log(
    `[Import] Chon ${solarSystemBodies.length} thien the he Mat Troi de import`,
  );

  for (const body of solarSystemBodies) {
    const name = body.englishName || body.name;
    const hasRing = Array.isArray(body.rings) && body.rings.length > 0;

    let category = "planet";
    if (body.bodyType === "Dwarf Planet") category = "dwarf-planet";
    else if (body.bodyType === "Moon") category = "moon";
    else if (body.bodyType === "Star") category = "star";

    const planetData = {
      name,
      imageUrl: PLANET_IMAGES[name] || "",
      size: formatSize(body.meanRadius),
      atmosphere: "", // API khong co du lieu nay, dien tay hoac bo sung sau
      distanceFromEarth:
        category === "moon"
          ? "Quay quanh hanh tinh chu"
          : "Thay doi theo quy dao",
      distanceFromSun: formatDistance(body.semimajorAxis),
      temperature: kelvinToCelsius(body.avgTemp),
      hasRing,
      tags: [category, hasRing ? "has-ring" : "no-ring"],
      funFacts: [],
    };

    await upsertBody(planetData, counters);
  }

  // 5. Sao (ngoai Mat Troi) - du lieu tinh, khong tu API
  for (const star of STARS) {
    const planetData = {
      name: star.name,
      imageUrl: "",
      size: "N/A",
      atmosphere: "",
      distanceFromEarth: formatLightYears(star.distanceLy),
      distanceFromSun: formatLightYears(star.distanceLy),
      temperature: `${star.tempK.toLocaleString("vi-VN")} K`,
      hasRing: false,
      tags: ["star", "no-ring"],
      funFacts: star.note ? [star.note] : [],
    };
    await upsertBody(planetData, counters);
  }

  // 6. Ho den - du lieu tinh, khong tu API
  for (const bh of BLACK_HOLES) {
    const planetData = {
      name: bh.name,
      imageUrl: "",
      size: `Khoi luong ${bh.massSolar}`,
      atmosphere: "",
      distanceFromEarth: formatLightYears(bh.distanceLy),
      distanceFromSun: formatLightYears(bh.distanceLy),
      temperature: "N/A",
      hasRing: false,
      tags: ["black-hole", "no-ring"],
      funFacts: bh.note ? [bh.note] : [],
    };
    await upsertBody(planetData, counters);
  }

  const total = counters.created + counters.updated;
  console.log(
    `\n[Import] Hoan tat! Tong: ${total} (tao moi: ${counters.created}, cap nhat: ${counters.updated})`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

importPlanets().catch((err) => {
  console.error("[Import] Loi:", err);
  process.exit(1);
});
