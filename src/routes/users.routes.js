import express from "express";
import { getMe, updateMe } from "../controllers/users.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Xem / cap nhat thong tin ca nhan + so thich (dung cho ca nhan hoa noi dung)
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);

export default router;
