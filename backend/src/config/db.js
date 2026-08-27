import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[DB] Ket noi MongoDB thanh cong");
  } catch (err) {
    console.error("[DB] Loi ket noi MongoDB:", err.message);
    process.exit(1);
  }
}
