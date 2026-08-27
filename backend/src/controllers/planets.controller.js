import Planet from "../models/Planet.js";
import { parseSearchIntent } from "../services/gemini.service.js";

// GET /planets - Lay danh sach hanh tinh (co filter, phan trang)
export async function listPlanets(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = {};

    if (req.query.hasRing !== undefined) {
      filter.hasRing = req.query.hasRing === "true";
    }

    const planets = await Planet.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 });

    res.json({ planets, page, limit });
  } catch (err) {
    next(err);
  }
}

// GET /planets/:planetId - Lay chi tiet 1 hanh tinh + goi y AI lien quan (chuc nang 1)
export async function getPlanetById(req, res, next) {
  try {
    const planet = await Planet.findById(req.params.planetId);
    if (!planet) {
      return res.status(404).json({ message: "Không tìm thấy hành tinh" });
    }

    // Goi y don gian dua tren tag/dac diem chung (co the nang cap len model ML that sau nay)
    const relatedSuggestions = await Planet.find({
      _id: { $ne: planet._id },
      hasRing: planet.hasRing,
    }).limit(4);

    res.json({ planet, relatedSuggestions });
  } catch (err) {
    next(err);
  }
}

// GET /planets/search?q=... - Tim kiem bang ngon ngu tu nhien (chuc nang 4)
export async function searchPlanets(req, res, next) {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ message: "Thiếu tham số tìm kiếm" });
    }

    const parsedFilter = await parseSearchIntent(q);

    const mongoFilter = {};
    if (parsedFilter.hasRing !== undefined) {
      mongoFilter.hasRing = parsedFilter.hasRing;
    }
    if (parsedFilter.keyword) {
      mongoFilter.name = { $regex: parsedFilter.keyword, $options: "i" };
    }

    const planets = await Planet.find(mongoFilter).limit(20);
    res.json({ planets });
  } catch (err) {
    next(err);
  }
}
