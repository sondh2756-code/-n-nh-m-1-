import NewsArticle from "../models/NewsArticle.js";

// GET /news/summary?page=...&limit=... - Tin tuc thien van da tom tat boi AI (chuc nang 6)
// Ghi chu: du lieu articles duoc dien vao DB boi 1 cron job rieng
// (crawl nguon tin -> goi summarizeArticle() trong gemini.service.js -> luu vao DB)
export async function getSummarizedNews(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const articles = await NewsArticle.find()
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ articles, page, limit });
  } catch (err) {
    next(err);
  }
}
