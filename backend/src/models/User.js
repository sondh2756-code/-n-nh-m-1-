import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      // ten dang nhap, dung de dang nhap, khong duoc trung
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      // email cua nguoi dung, khong duoc trung
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      // mat khau da duoc ma hoa (khong luu mat khau goc)
      type: String,
      required: true,
    },
    displayName: {
      // ten hien thi tren giao dien (vd: ngoai trang chu, avatar...)
      type: String,
      required: false,
      trim: true,
    },
    avatarUrl: {
      // duong dan anh dai dien
      type: String,
      required: false,
      default: "",
    },
    location: {
      // vi tri/khu vuc cua nguoi dung (dung cho goi y ngam sao theo vi tri)
      type: String,
      required: false,
    },
    role: {
      // phan quyen: "user" (mac dinh) hoac "admin" (xem duoc dashboard analytics)
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      // luu refreshToken hien tai cua user, dung de xac thuc khi lam moi accessToken
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;
