import express from "express";
import { sendMessage, getHistory } from "../controllers/chatbot.controller.js";
import {
  optionalAuth,
  requireAuth,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Chuc nang 2: Chatbot thien van AI
router.post("/message", optionalAuth, sendMessage); // cho phep ca guest
router.get("/history/:conversationId", requireAuth, getHistory);

export default router;
