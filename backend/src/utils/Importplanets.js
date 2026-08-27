// Import du lieu thien the (hanh tinh, hanh tinh lun, ve tinh, mat troi,
// sao va ho den) vao MongoDB.
//
// NGUON DU LIEU (da sua so voi ban truoc):
// - Hanh tinh / hanh tinh lun / ve tinh / Mat Troi: lay THAT tu Solar System
//   OpenData API (chi co du lieu he Mat Troi).
// - ANH: lay THAT tu NASA Images API (images-api.nasa.gov, mien phi, khong
//   can key) bang cach tim theo ten thien the, thay vi de trong "" nhu ban
//   cu. 8 hanh tinh chinh van dung anh chinh thuc NASA da chon san (chat
//   luong on dinh hon ket qua search).
// - SAO (ngoai He Mat Troi): truoc day la so lieu go tay uoc luong (khong co
//   nguon), gio duoc thay bang du lieu THAT trich tu HYG Database
//   (astronexus/HYG-Database, catalog sao mo nguon mo, https://github.com/astronexus/HYG-Database).
//   Khoang cach (distanceLy) tinh tu parallax that trong catalog; nhiet do
//   (tempK) uoc luong tu chi so mau B-V (ci) that bang cong thuc Ballesteros
//   (2012): T = 4600 * (1/(0.92*ci+1.7) + 1/(0.92*ci+0.62)). Nhung sao khong
//   co trong catalog (vd Gliese 581, TRAPPIST-1, Sirius B) da duoc bo ra
//   thay vi giu so lieu khong kiem chung duoc.
// - HO DEN: van la du lieu tinh (hardcode) vi khong co API mien phi, nhung
//   la cac so lieu khoi luong/khoang cach da duoc cong bo trong nghien cuu
//   khoa hoc (co the kiem chung tren Wikipedia/NASA), khong phai bia dat.
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

// NASA Images API - mien phi, khong can API key
const NASA_IMAGES_URL = "https://images-api.nasa.gov/search";

// Anh minh hoa cho 8 hanh tinh chinh (anh chinh thuc NASA, on dinh hon la
// tin tuong ket qua dau tien cua search)
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
// DANH SACH SAO (khong tinh Mat Troi) - du lieu THAT trich tu HYG Database
// (astronexus/HYG-Database), khoang cach quy doi tu parallax that, nhiet do
// uoc luong tu chi so mau B-V that bang cong thuc Ballesteros (2012).
// ---------------------------------------------------------------------
const STARS = [
  {
    name: "Sirius",
    distanceLy: 8.6,
    tempK: 10014,
    spectralType: "A0m",
    constellation: "Đại Khuyển",
    note: "Ngôi sao sáng nhất bầu trời đêm, thuộc chòm Đại Khuyển (Canis Major).",
  },
  {
    name: "Proxima Centauri",
    distanceLy: 4.23,
    tempK: 3383,
    spectralType: "M5Ve",
    constellation: "Bán Nhân Mã",
    note: "Ngôi sao gần Mặt Trời nhất, thuộc hệ ba sao Alpha Centauri.",
  },
  {
    name: "Alpha Centauri A",
    distanceLy: 4.32,
    tempK: 5568,
    spectralType: "G2V",
    constellation: "Bán Nhân Mã",
    note: "Thành phần chính (A) của hệ sao gần Trái Đất nhất, tên IAU chính thức là Rigil Kentaurus.",
  },
  {
    name: "Alpha Centauri B",
    distanceLy: 4.32,
    tempK: 4996,
    spectralType: "K1V",
    constellation: "Bán Nhân Mã",
    note: "Thành phần B trong hệ Alpha Centauri, tên IAU chính thức là Toliman.",
  },
  {
    name: "Barnard's Star",
    distanceLy: 5.95,
    tempK: 3691,
    spectralType: "sdM4",
    constellation: "Xà Phu",
    note: "Sao lùn đỏ có chuyển động riêng nhanh nhất trên bầu trời.",
  },
  {
    name: "Wolf 359",
    distanceLy: 7.8,
    tempK: 3169,
    spectralType: "M6",
    constellation: "Sư Tử",
    note: "Một trong những sao gần Trái Đất nhất, rất mờ, chỉ thấy qua kính thiên văn.",
  },
  {
    name: "Epsilon Eridani",
    distanceLy: 10.49,
    tempK: 5048,
    spectralType: "K2V",
    constellation: "Ba Giang",
    note: "Sao trẻ, tên IAU chính thức là Ran, có đĩa hành tinh đang được nghiên cứu.",
  },
  {
    name: "Tau Ceti",
    distanceLy: 11.91,
    tempK: 5511,
    spectralType: "G8V",
    constellation: "Kình Ngư",
    note: "Sao giống Mặt Trời về quang phổ, có nhiều ứng viên hành tinh.",
  },
  {
    name: "Altair",
    distanceLy: 16.73,
    tempK: 8004,
    spectralType: "A7IV-V",
    constellation: "Thiên Ưng",
    note: "Một trong ba đỉnh của Tam giác Mùa Hè, quay rất nhanh.",
  },
  {
    name: "Vega",
    distanceLy: 25.04,
    tempK: 10138,
    spectralType: "A0Vvar",
    constellation: "Thiên Cầm",
    note: "Từng là sao Bắc Cực cách đây khoảng 12.000 năm.",
  },
  {
    name: "Fomalhaut",
    distanceLy: 25.13,
    tempK: 8615,
    spectralType: "A3V",
    constellation: "Nam Ngư",
    note: "Có đĩa bụi bao quanh, từng chụp được ảnh trực tiếp 1 ngoại hành tinh.",
  },
  {
    name: "Pollux",
    distanceLy: 33.78,
    tempK: 4764,
    spectralType: "K0IIIvar",
    constellation: "Song Tử",
    note: "Sao khổng lồ cam, sáng nhất chòm sao Song Tử.",
  },
  {
    name: "Capella",
    distanceLy: 42.8,
    tempK: 5296,
    spectralType: "G/M (hệ nhiều sao)",
    constellation: "Ngự Phu",
    note: "Hệ nhiều sao, sáng thứ 6 trên bầu trời đêm.",
  },
  {
    name: "Arcturus",
    distanceLy: 36.72,
    tempK: 4234,
    spectralType: "K2IIIp",
    constellation: "Mục Phu",
    note: "Sao khổng lồ đỏ sáng, sáng nhất bán cầu bắc.",
  },
  {
    name: "Aldebaran",
    distanceLy: 66.64,
    tempK: 3737,
    spectralType: "K5III",
    constellation: "Kim Ngưu",
    note: "Sao khổng lồ đỏ, được gọi là 'mắt bò' trong chòm sao Kim Ngưu.",
  },
  {
    name: "Regulus",
    distanceLy: 79.3,
    tempK: 11359,
    spectralType: "B7V",
    constellation: "Sư Tử",
    note: "Sao quay cực nhanh, gần như bị bẹp ở hai cực.",
  },
  {
    name: "Spica",
    distanceLy: 249.74,
    tempK: 14492,
    spectralType: "B1V",
    constellation: "Xử Nữ",
    note: "Hệ sao đôi rất sáng trong chòm sao Xử Nữ.",
  },
  {
    name: "Antares",
    distanceLy: 553.75,
    tempK: 3316,
    spectralType: "M1Ib + B2.5V",
    constellation: "Thiên Yết",
    note: "Sao siêu khổng lồ đỏ, kích thước gấp hàng trăm lần Mặt Trời.",
  },
  {
    name: "Betelgeuse",
    distanceLy: 497.95,
    tempK: 3794,
    spectralType: "M2Ib",
    constellation: "Lạp Hộ",
    note: "Sao siêu khổng lồ đỏ sắp kết thúc vòng đời, có thể nổ siêu tân tinh trong tương lai.",
  },
  {
    name: "Rigel",
    distanceLy: 862.85,
    tempK: 10516,
    spectralType: "B8Ia",
    constellation: "Lạp Hộ",
    note: "Sao siêu khổng lồ xanh, sáng nhất chòm sao Lạp Hộ.",
  },
  {
    name: "Deneb",
    distanceLy: 1411.93,
    tempK: 9106,
    spectralType: "A2Ia",
    constellation: "Thiên Nga",
    note: "Một đỉnh của Tam giác Mùa Hè, cực kỳ sáng dù nằm rất xa.",
  },
  {
    name: "Canopus",
    distanceLy: 309.15,
    tempK: 8453,
    spectralType: "F0Ib",
    constellation: "Thuyền Để",
    note: "Sao sáng thứ hai trên bầu trời đêm, sau Sirius.",
  },
  {
    name: "Polaris",
    distanceLy: 432.57,
    tempK: 5830,
    spectralType: "F7:Ib-IIv",
    constellation: "Tiểu Hùng",
    note: "Sao Bắc Cực hiện tại, gần như đứng yên trên bầu trời bắc.",
  },
  {
    name: "Mira",
    distanceLy: 298.95,
    tempK: 4826,
    spectralType: "M5e-M9e",
    constellation: "Kình Ngư",
    note: "Sao biến quang điển hình, độ sáng thay đổi rõ rệt theo chu kỳ.",
  },
  {
    name: "Achernar",
    distanceLy: 139.44,
    tempK: 12650,
    spectralType: "B3Vp",
    constellation: "Ba Giang",
    note: "Một trong những sao bị bẹp mạnh nhất do quay cực nhanh.",
  },
  {
    name: "Bellatrix",
    distanceLy: 252.44,
    tempK: 14192,
    spectralType: "B2III",
    constellation: "Lạp Hộ",
    note: "'Sao Nữ Chiến Binh', nằm ở vai chòm sao Lạp Hộ.",
  },
  {
    name: "Mizar",
    distanceLy: 85.81,
    tempK: 9466,
    spectralType: "A2V",
    constellation: "Đại Hùng",
    note: "Sao đôi nổi tiếng trong chuôi Bắc Đẩu, dễ quan sát bằng mắt thường.",
  },
  {
    name: "Alcor",
    distanceLy: 81.72,
    tempK: 8411,
    spectralType: "A5V",
    constellation: "Đại Hùng",
    note: "Sao đồng hành quang học của Mizar, từng là thử thách thị lực kinh điển.",
  },
  {
    name: "61 Cygni A",
    distanceLy: 11.37,
    tempK: 4583,
    spectralType: "K5V",
    constellation: "Thiên Nga",
    note: "Thành phần A của hệ sao đôi 61 Cygni, sao đầu tiên đo được khoảng cách bằng thị sai (năm 1838).",
  },
  {
    name: "Kapteyn's Star",
    distanceLy: 12.76,
    tempK: 3730,
    spectralType: "M0V",
    constellation: "Họa Giá",
    note: "Sao lùn đỏ có vận tốc rất cao, có thể có nguồn gốc từ một thiên hà lùn bị Ngân Hà nuốt chửng.",
  },
  {
    name: "Procyon",
    distanceLy: 11.46,
    tempK: 6714,
    spectralType: "F5IV-V",
    constellation: "Tiểu Khuyển",
    note: "Sao sáng thứ 8 trên bầu trời, có bạn đồng hành là sao lùn trắng.",
  },
];

// ---------------------------------------------------------------------
// DANH SACH HO DEN NOI TIENG - so lieu khoi luong/khoang cach lay tu cac
// nghien cuu da cong bo (co the kiem chung tren Wikipedia/NASA), khong co
// API mien phi nen van phai liet ke tinh.
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tim anh THAT tu NASA Images API theo ten thien the. Tra ve "" neu khong
// tim thay hoac API loi (khong lam gian doan qua trinh import).
async function fetchNasaImage(query) {
  try {
    const url = `${NASA_IMAGES_URL}?q=${encodeURIComponent(query)}&media_type=image`;
    const res = await fetch(url);
    if (!res.ok) return "";

    const data = await res.json();
    const items = data.collection?.items || [];
    if (items.length === 0) return "";

    // Uu tien item co tieu de gan dung nhat voi query (tranh anh khong lien quan)
    const firstWithLink = items.find((item) => item.links?.[0]?.href);
    return firstWithLink?.links?.[0]?.href || "";
  } catch (err) {
    console.warn(`  -> Không tìm được ảnh NASA cho "${query}": ${err.message}`);
    return "";
  }
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

    // 8 hanh tinh chinh dung anh curated san; con lai (hanh tinh lun, ve
    // tinh, Mat Troi) tim anh that qua NASA Images API
    let imageUrl = PLANET_IMAGES[name] || "";
    if (!imageUrl) {
      imageUrl = await fetchNasaImage(`${name} NASA`);
      await sleep(300); // tranh goi API qua nhanh lien tuc
    }

    const planetData = {
      name,
      imageUrl,
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

  // 5. Sao (ngoai Mat Troi) - du lieu that tu HYG Database + anh that tu
  // NASA Images API
  for (const star of STARS) {
    const imageUrl = await fetchNasaImage(`${star.name} star`);
    await sleep(300);

    const planetData = {
      name: star.name,
      imageUrl,
      size: "N/A",
      atmosphere: "",
      distanceFromEarth: formatLightYears(star.distanceLy),
      distanceFromSun: formatLightYears(star.distanceLy),
      temperature: `${star.tempK.toLocaleString("vi-VN")} K`,
      hasRing: false,
      tags: ["star", "no-ring", star.constellation],
      funFacts: [
        star.note,
        `Loại quang phổ: ${star.spectralType}.`,
        `Nằm trong chòm sao ${star.constellation}.`,
      ].filter(Boolean),
    };
    await upsertBody(planetData, counters);
  }

  // 6. Ho den - du lieu tinh (da cong bo), anh that tu NASA Images API
  for (const bh of BLACK_HOLES) {
    const imageUrl = await fetchNasaImage(`${bh.name} black hole`);
    await sleep(300);

    const planetData = {
      name: bh.name,
      imageUrl,
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