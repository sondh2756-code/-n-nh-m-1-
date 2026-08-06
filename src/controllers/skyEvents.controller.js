import SkyEvent from "../models/SkyEvent.js";

// GET /sky-events?from=...&to=...&region=... - Danh sach su kien thien van sap toi (chuc nang 3, 9)
export async function listEvents(req, res, next) {
  try {
    const { from, to, region } = req.query;
    const filter = {};

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (region) {
      filter.visibilityRegion = region;
    }

    const events = await SkyEvent.find(filter).sort({ date: 1 });
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

// POST /sky-events/alerts/subscribe - Dang ky nhan canh bao su kien (chuc nang 9)
// Ghi chu: ban demo don gian, chua gui email/push that.
// Muon lam day du can tich hop them nodemailer hoac web-push.
export async function subscribeAlerts(req, res, next) {
  try {
    const { eventTypes } = req.body;

    if (!Array.isArray(eventTypes) || eventTypes.length === 0) {
      return res.status(400).json({ message: "eventTypes phai la mang khong rong" });
    }

    res.status(201).json({ subscriptionId: req.user.id, eventTypes });
  } catch (err) {
    next(err);
  }
}
