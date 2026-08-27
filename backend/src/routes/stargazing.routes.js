import express from "express";
import {
  getRecommendations,
  identifyConstellation,
} from "../controllers/stargazing.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Chuc nang 3: Goi y ngam sao ca nhan hoa
router.get("/recommendations", optionalAuth, getRecommendations);

// Chuc nang 5: Mo-dun nhan dien choi sao (upload anh bau troi dem)
router.post(
  "/constellations/identify",
  optionalAuth,
  upload.single("file"),
  identifyConstellation,
);

export default router;
