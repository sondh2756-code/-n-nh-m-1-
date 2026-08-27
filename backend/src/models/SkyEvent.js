import mongoose from "mongoose";

const skyEventSchema = new mongoose.Schema(
  {
    eventName: {
      // ten su kien thien van, vd: "Mua sao bang Perseids"
      type: String,
      required: true,
      trim: true,
    },
    date: {
      // ngay dien ra su kien
      type: Date,
      required: true,
    },
    visibilityRegion: {
      // khu vuc co the quan sat duoc su kien
      type: String,
      required: false,
      default: "Toan cau",
    },
    description: {
      // mo ta chi tiet ve su kien
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const SkyEvent = mongoose.model("SkyEvent", skyEventSchema);

export default SkyEvent;
