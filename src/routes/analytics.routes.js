import express from "express";
import {
  trackEvent,
  getDashboard,
} from "../controllers/analytics.controller.js";
import {
  optionalAuth,
  requireAuth,
  requireAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Chuc nang 8: Phan tich khach truy cap dua tren AI
router.post("/track", optionalAuth, trackEvent);

// Chuc nang 9: Du lieu tong hop cho Dashboard (chi admin xem duoc)
router.get("/dashboard", requireAuth, requireAdmin, getDashboard);

export default router;
