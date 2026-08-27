import express from "express";
import { getSummarizedNews } from "../controllers/news.controller.js";

const router = express.Router();

// Chuc nang 6: Tin tuc thien van & Trinh tom tat AI
router.get("/summary", getSummarizedNews);

export default router;
