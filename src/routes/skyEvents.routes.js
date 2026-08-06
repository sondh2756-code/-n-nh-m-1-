import express from "express";
import {
  listEvents,
  subscribeAlerts,
} from "../controllers/skyEvents.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Chuc nang 3 (mo rong): Mua sao bang, nguyet thuc/nhat thuc
// Chuc nang 9: Canh bao su kien thien the tren Dashboard
router.get("/", listEvents);
router.post("/alerts/subscribe", requireAuth, subscribeAlerts);

export default router;
