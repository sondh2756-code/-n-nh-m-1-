import express from "express";
import { getNearby } from "../controllers/observatories.controller.js";

const router = express.Router();

// Chuc nang 7: He thong goi y dai thien van (dung Geolocation)
router.get("/nearby", getNearby);

export default router;
