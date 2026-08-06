import jwt from "jsonwebtoken";

// Tao accessToken - song ngan (mac dinh 15 phut), dung de xac thuc moi request
export function signAccessToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
}

// Tao refreshToken - song lau (mac dinh 7 ngay), dung de lay accessToken moi
export function signRefreshToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );
}

// Kiem tra refreshToken con hop le khong
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
