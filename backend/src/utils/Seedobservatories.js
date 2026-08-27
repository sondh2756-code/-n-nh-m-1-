import mongoose from "mongoose";
import dotenv from "dotenv";
import Observatory from "../models/Observatory.js";

dotenv.config();

// Du lieu mau: mot so dai quan sat / CLB thien van tai Viet Nam
const sampleData = [
  {
    name: "Dai quan sat thien van Hoa Lac (VNSC)",
    latitude: 21.0139,
    longitude: 105.5222,
    rating: 4.6,
    weatherDependency: true,
  },
  {
    name: "CLB Thien van nghiep du Ha Noi (HAAC)",
    latitude: 21.0285,
    longitude: 105.8542,
    rating: 4.3,
    weatherDependency: true,
  },
  {
    name: "CLB Thien van nghiep du TP.HCM (HAAC HCM)",
    latitude: 10.7769,
    longitude: 106.7009,
    rating: 4.4,
    weatherDependency: true,
  },
  {
    name: "Dai quan sat Nha Trang",
    latitude: 12.2388,
    longitude: 109.1967,
    rating: 4.1,
    weatherDependency: true,
  },
  {
    name: "Trung tam Kham pha Khoa hoc & Cong nghe Quy Nhon",
    latitude: 13.7563,
    longitude: 109.2297,
    rating: 4.7,
    weatherDependency: false,
  },
  {
    name: "CLB Thien van Da Nang",
    latitude: 16.0544,
    longitude: 108.2022,
    rating: 4.0,
    weatherDependency: true,
  },
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("Khong tim thay MONGO_URI trong file .env");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Da ket noi MongoDB");

    await Observatory.deleteMany({});
    console.log("Da xoa du lieu Observatory cu");

    const inserted = await Observatory.insertMany(sampleData);
    console.log(`Da them ${inserted.length} dai quan sat mau`);

    process.exit(0);
  } catch (err) {
    console.error("Loi khi seed du lieu:", err.message);
    process.exit(1);
  }
}

seed();
