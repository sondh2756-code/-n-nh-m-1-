import mongoose from "mongoose";

const planetSchema = new mongoose.Schema(
  {
    name: {
      // ten hanh tinh, vd: "Sao Moc"
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      // duong dan hinh anh hanh tinh
      type: String,
      required: false,
      default: "",
    },
    size: {
      // kich thuoc (duong kinh) cua hanh tinh
      type: String,
      required: false,
    },
    atmosphere: {
      // thanh phan khi quyen
      type: String,
      required: false,
    },
    distanceFromEarth: {
      // khoang cach tu hanh tinh nay den Trai Dat
      type: String,
      required: false,
    },
    distanceFromSun: {
      // khoang cach tu hanh tinh nay den Mat Troi
      type: String,
      required: false,
    },
    temperature: {
      // nhiet do trung binh be mat
      type: String,
      required: false,
    },
    hasRing: {
      // hanh tinh co vanh dai hay khong
      type: Boolean,
      required: false,
      default: false,
    },
    funFacts: {
      // danh sach cac su that thu vi ve hanh tinh
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const Planet = mongoose.model("Planet", planetSchema);

export default Planet;
