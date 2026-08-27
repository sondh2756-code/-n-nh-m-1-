import {
  getCloudCover,
  computeStargazingScore,
} from "../services/weather.service.js";

// GET /stargazing/recommendations?lat=...&lng=... - Goi y ngam sao ca nhan hoa (chuc nang 3)
export async function getRecommendations(req, res, next) {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Thiếu tọa độ vĩ độ và kinh độ" });
    }

    const weather = await getCloudCover(lat, lng);
    const score = computeStargazingScore(weather.cloudCoverPercent);

    let tip;
    if (score === null) {
      tip = "Khong the danh gia, vui long thu lai sau.";
    } else if (score >= 70) {
      tip = "Bau troi dem nay kha quang dang, rat thich hop de ngam sao!";
    } else if (score >= 40) {
      tip = "May che phu mot phan, van co the ngam duoc nhung khong ly tuong.";
    } else {
      tip = "May day dac, nen chon ngay khac de ngam sao.";
    }

    res.json({
      recommendations: [
        {
          score,
          cloudCoverPercent: weather.cloudCoverPercent,
          temperature: weather.temperature,
          weatherDescription: weather.description,
          tip,
        },
      ],
    });
  } catch (err) {
    next(err);
  }
}

// POST /stargazing/constellations/identify - Nhan dien choi sao tu anh (chuc nang 5)
// LUU Y: day la ban demo tra ve ket qua gia lap (mock), CHUA phai model Computer Vision that.
// Huong nang cap that: dung OpenCV / model tren Hugging Face de xu ly file anh trong req.file.
export async function identifyConstellation(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên một ảnh" });
    }

    // TODO: thay doan nay bang xu ly OpenCV/model that
    const mockResult = {
      constellation: "Ursa Major (Gau Lon)",
      confidence: 0.72,
    };

    res.json(mockResult);
  } catch (err) {
    next(err);
  }
}
