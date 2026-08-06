import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";

// GET /users/me - Lay thong tin nguoi dung hien tai
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash -refreshToken");
    if (!user) {
      return res.status(404).json({ message: "Khong tim thay user" });
    }

    const preferences = await UserPreference.findOne({ userId: user._id });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      location: user.location,
      preferences: preferences || { favoritePlanets: [], favoriteTopics: [] },
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /users/me - Cap nhat thong tin/so thich ca nhan hoa
export async function updateMe(req, res, next) {
  try {
    const { displayName, favoritePlanets, favoriteTopics, location } = req.body;

    const update = {};
    if (displayName !== undefined) update.displayName = displayName;
    if (location !== undefined) update.location = location;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
    }).select("-passwordHash -refreshToken");

    if (favoritePlanets !== undefined || favoriteTopics !== undefined) {
      const prefUpdate = {};
      if (favoritePlanets !== undefined) prefUpdate.favoritePlanets = favoritePlanets;
      if (favoriteTopics !== undefined) prefUpdate.favoriteTopics = favoriteTopics;

      await UserPreference.findOneAndUpdate(
        { userId: req.user.id },
        { $set: prefUpdate },
        { upsert: true, new: true }
      );
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}
