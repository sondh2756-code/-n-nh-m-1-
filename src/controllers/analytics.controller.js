import AnalyticsEvent from "../models/AnalyticsEvent.js";

// POST /analytics/track - Ghi nhan hanh vi nguoi dung (chuc nang 8)
export async function trackEvent(req, res, next) {
  try {
    const { eventType, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({ message: "Thieu eventType" });
    }

    await AnalyticsEvent.create({
      userId: req.user?.id || null,
      eventType,
      metadata: metadata || {},
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({ message: "Da ghi nhan" });
  } catch (err) {
    next(err);
  }
}

// GET /analytics/dashboard?from=...&to=... - Du lieu tong hop cho dashboard (chuc nang 9, chi admin)
export async function getDashboard(req, res, next) {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const [totalEvents, byType, topPlanets] = await Promise.all([
      AnalyticsEvent.countDocuments(match),
      AnalyticsEvent.aggregate([
        { $match: match },
        { $group: { _id: "$eventType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { ...match, eventType: "view_planet" } },
        { $group: { _id: "$metadata.planetId", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      stats: { totalEvents, byType, topPlanets },
    });
  } catch (err) {
    next(err);
  }
}
