import mongoose from "mongoose";

const observatorySchema = new mongoose.Schema(
  {
    name: {
      // ten dai quan sat / cau lac bo thien van
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      // vi do (dung de tinh khoang cach, hien thi tren ban do)
      type: Number,
      required: true,
    },
    longitude: {
      // kinh do
      type: Number,
      required: true,
    },
    rating: {
      // diem danh gia trung binh (thang diem 0-5)
      type: Number,
      required: false,
      default: 0,
      min: 0,
      max: 5,
    },
    weatherDependency: {
      // co phu thuoc vao thoi tiet hay khong (dai lo thien thi phu thuoc nhieu)
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const Observatory = mongoose.model("Observatory", observatorySchema);

export default Observatory;
