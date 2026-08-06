import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngay
};

// POST /auth/signup - Tao tai khoan moi
export async function signup(req, res, next) {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Thieu email, password hoac username" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Email hoac username da ton tai" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      passwordHash,
      displayName: `${firstName || ""} ${lastName || ""}`.trim() || username,
    });

    res.status(201).json({ userId: user._id });
  } catch (err) {
    next(err);
  }
}

// POST /auth/signin - Dang nhap
export async function signin(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thieu username hoac password" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) {
      return res.status(401).json({ message: "Sai username hoac password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai username hoac password" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken, userId: user._id });
  } catch (err) {
    next(err);
  }
}

// POST /auth/signout - Dang xuat
export async function signout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await User.updateOne({ refreshToken: token }, { $set: { refreshToken: null } });
    }
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// POST /auth/refresh - Tao accessToken moi neu refreshToken con han
export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Khong co refresh token" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(403).json({ message: "Refresh token khong hop le hoac het han" });
    }

    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token khong hop le" });
    }

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}
