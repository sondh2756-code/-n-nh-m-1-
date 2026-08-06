import mongoose from "mongoose";

// Dung cho chuc nang 6: Tin tuc thien van & Trinh tom tat AI
const newsArticleSchema = new mongoose.Schema(
  {
    title: {
      // tieu de bai bao
      type: String,
      required: true,
    },
    sourceUrl: {
      // duong dan toi bai bao goc
      type: String,
    },
    sourceName: {
      // ten nguon tin, vd: "NASA News"
      type: String,
    },
    summary: {
      // noi dung da duoc AI tom tat
      type: String,
    },
    publishedAt: {
      // ngay dang bai
      type: Date,
    },
  },
  { timestamps: true }
);

const NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);

export default NewsArticle;
