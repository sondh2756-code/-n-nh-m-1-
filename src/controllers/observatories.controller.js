import Observatory from "../models/Observatory.js";

// Cong thuc Haversine - tinh khoang cach (km) giua 2 toa do tren Trai Dat
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // ban kinh Trai Dat (km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /observatories/nearby?lat=...&lng=...&radius=... - Goi y dai quan sat gan vi tri (chuc nang 7)
export async function getNearby(req, res, next) {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Thieu toa do lat, lng" });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius) || 50; // mac dinh 50km

    // Lay tat ca roi loc bang khoang cach that (phu hop du lieu nho; du lieu lon nen dung $geoNear)
    const all = await Observatory.find();

    const observatories = all
      .map((obs) => ({
        ...obs.toObject(),
        distanceKm: getDistanceKm(userLat, userLng, obs.latitude, obs.longitude),
      }))
      .filter((obs) => obs.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 20);

    res.json({ observatories });
  } catch (err) {
    next(err);
  }
}
