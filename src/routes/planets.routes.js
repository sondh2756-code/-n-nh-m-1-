import express from "express";
import {
  listPlanets,
  getPlanetById,
  searchPlanets,
} from "../controllers/planets.controller.js";

const router = express.Router();

// Chuc nang 1: He thong thong tin hanh tinh dua tren AI
// Chuc nang 4: Tim kiem thong minh tich hop AI (route /search)

// Luu y: /search PHAI dat truoc /:planetId, neu khong Express se hieu "search" la 1 planetId
router.get("/search", searchPlanets);
router.get("/:planetId", getPlanetById);
router.get("/", listPlanets);

export default router;
