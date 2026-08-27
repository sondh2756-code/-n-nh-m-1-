import jwt from "jsonwebtoken";

// Bat buoc phai dang nhap (co accessToken hop le trong header Authorization)
// Dung cho cac route: /users/me, /chatbot/history, /sky-events/alerts/subscribe...
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // gan thong tin user vao request de controller phia sau dung duoc
    req.user = { id: payload.userId, role: payload.role };
    next(); // cho phep di tiep toi controller
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Mã xác thực không hợp lệ hoặc đã hết hạn" });
  }
}

// Cho phep ca khach (guest) lan nguoi da dang nhap
// Neu co token hop le thi gan req.user, khong co cung khong chan request
// Dung cho: /chatbot/message, /stargazing/recommendations, /analytics/track...
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return next(); // khong co token -> coi nhu khach, van cho di tiep

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.userId, role: payload.role };
  } catch (err) {
    // token sai/het han -> khong bao loi, chi coi nhu khach
  }
  next();
}

// Chi cho phep admin di tiep - PHAI dat SAU requireAuth trong route
// Dung cho: /analytics/dashboard
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
}
