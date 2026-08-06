import mongoose from "mongoose";

// Schema linh hoat (metadata: Mixed) vi moi loai su kien co du lieu khac nhau
// Dung cho chuc nang 8: Phan tich khach truy cap dua tren AI
const analyticsEventSchema = new mongoose.Schema(
  {
    userId: {
      // nguoi dung thuc hien hanh dong, de null neu la khach
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    eventType: {
      // loai hanh dong, vd: "view_planet", "search", "click_chatbot"
      type: String,
      required: true,
    },
    metadata: {
      // du lieu chi tiet di kem, vd: { planetId: "..." }
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      // dia chi IP nguoi dung (phuc vu thong ke)
      type: String,
    },
    userAgent: {
      // thong tin trinh duyet/thiet bi
      type: String,
    },
  },
  { timestamps: true }
);

const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);

export default AnalyticsEvent;
