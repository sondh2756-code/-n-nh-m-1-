import mongoose from "mongoose";

const constellationSchema = new mongoose.Schema(
  {
    name: {
      // ten chom sao, vd: "Gau Lon"
      type: String,
      required: true,
      trim: true,
    },
    description: {
      // mo ta ve chom sao
      type: String,
      required: false,
    },
    mapImage: {
      // hinh anh ban do vi tri chom sao tren bau troi
      type: String,
      required: false,
      default: "",
    },
    visibleMonths: {
      // cac thang trong nam co the quan sat duoc chom sao nay, vd: ["1", "2", "12"]
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const Constellation = mongoose.model("Constellation", constellationSchema);

export default Constellation;
