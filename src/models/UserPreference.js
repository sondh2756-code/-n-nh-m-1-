import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      // tham chieu toi User so huu so thich nay (quan he 1-1 voi User)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    favoritePlanets: {
      // danh sach id cac hanh tinh (Planet) ma user yeu thich
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Planet",
      default: [],
    },
    favoriteTopics: {
      // danh sach chu de yeu thich, vd: ["ho den", "thien ha", "sao chet"]
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);

export default UserPreference;
