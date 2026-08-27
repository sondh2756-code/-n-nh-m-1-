// Import du lieu tin tuc thien van vao MongoDB.
// Tin duoc tong hop tu cac nguon uy tin (NASA, Tuoi Tre, Suc Khoe Doi Song...),
// noi dung "summary" da duoc viet lai (khong sao chep nguyen van) de dung
// truc tiep cho chuc nang 6 (Tom tat tin tuc AI). Neu muon tu dong sinh
// summary bang Gemini tu noi dung bai goc, co the goi
// summarizeArticle(title, content) trong services/gemini.service.js truoc
// khi luu.
//
// Chay: node src/utils/importNews.js

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import NewsArticle from "../models/NewsArticle.js";

const NEWS_ARTICLES = [
  {
    title: "NASA chuẩn bị phóng kính viễn vọng không gian Nancy Grace Roman",
    sourceUrl: "https://en.wikipedia.org/wiki/Nancy_Grace_Roman_Space_Telescope",
    sourceName: "NASA / Wikipedia",
    summary:
      "NASA dự kiến phóng kính viễn vọng không gian Nancy Grace Roman từ Trung tâm Vũ trụ Kennedy, Florida vào cuối tháng 8/2026. Kính có trường nhìn rộng gấp hơn 100 lần Hubble, phục vụ nghiên cứu năng lượng tối và tìm kiếm ngoại hành tinh.",
    publishedAt: new Date("2026-08-04"),
  },
  {
    title: "Phát hiện hai hành tinh khổng lồ có mật độ thấp hơn cả kẹo bông gòn",
    sourceUrl: "https://tuoitre.vn/nasa.html",
    sourceName: "Tuổi Trẻ Online",
    summary:
      "Các nhà thiên văn học phát hiện hai hành tinh khí khổng lồ có mật độ cực thấp, xốp hơn cả kẹo bông gòn, quay quanh một ngôi sao cách Trái Đất khoảng 1.110 năm ánh sáng. Phát hiện giúp làm sáng tỏ thêm về sự đa dạng trong quá trình hình thành hành tinh.",
    publishedAt: new Date("2026-08-10"),
  },
  {
    title: "NASA lên kế hoạch giải cứu đài quan sát Neil Gehrels Swift",
    sourceUrl: "https://tuoitre.vn/nasa.html",
    sourceName: "Tuổi Trẻ Online",
    summary:
      "Đài quan sát tia X Neil Gehrels Swift sau hơn 20 năm hoạt động đang có nguy cơ rơi vào khí quyển Trái Đất và vỡ vụn. NASA hợp tác với một công ty tư nhân để dùng tàu robot nâng quỹ đạo, kéo dài thời gian hoạt động của đài quan sát này.",
    publishedAt: new Date("2026-07-15"),
  },
  {
    title: "Kính viễn vọng James Webb phát hiện thiên hà cổ xưa như 'hóa thạch sống'",
    sourceUrl: "https://suckhoedoisong.vn/co-hoi-chiem-nguong-hang-loat-hien-tuong-thien-van-ky-thu-trong-thang-8-169260728084708363.htm",
    sourceName: "Sức Khỏe Đời Sống",
    summary:
      "Kính viễn vọng không gian James Webb ghi nhận một thiên hà đặc biệt cổ xưa với thành phần hóa học nguyên thủy nhất từng được quan sát, giúp giới khoa học hiểu rõ hơn về vũ trụ ở giai đoạn sơ khai.",
    publishedAt: new Date("2026-07-28"),
  },
  {
    title: "Máy bay siêu thanh X-59 của NASA hoàn thành chuyến bay thử đầu tiên",
    sourceUrl: "https://tuoitre.vn/nasa.html",
    sourceName: "Tuổi Trẻ Online",
    summary:
      "Máy bay thử nghiệm siêu thanh X-59 của NASA đã hoàn tất chuyến bay đầu tiên, mở đường cho công nghệ bay siêu thanh giảm tiếng nổ, dự kiến ứng dụng vào cuối năm 2026.",
    publishedAt: new Date("2026-06-30"),
  },
  {
    title: "Một tiểu hành tinh lớn bay ngang qua Trái Đất, an toàn nhưng đủ gần để quan sát",
    sourceUrl: "https://tuoitre.vn/nasa.html",
    sourceName: "Tuổi Trẻ Online",
    summary:
      "Một tiểu hành tinh kích thước lớn đã bay ngang Trái Đất ở khoảng cách đủ an toàn, tạo cơ hội hiếm để các nhà khoa học quan sát và đo đạc kỹ bằng radar.",
    publishedAt: new Date("2026-06-27"),
  },
  {
    title: "Tháng 8/2026: Cơ hội hiếm quan sát 6 hành tinh, nhật thực toàn phần và mưa sao băng Perseids trong cùng một ngày",
    sourceUrl: "https://bazaarvietnam.vn/dai-tiec-thien-van-ngay-12-8-2026/",
    sourceName: "Harper's Bazaar Việt Nam",
    summary:
      "Ngày 12/8/2026 hội tụ ba sự kiện thiên văn hiếm gặp trong 24 giờ: sáu hành tinh xếp thẳng hàng trước bình minh, nhật thực toàn phần quan sát được ở Greenland - Iceland - Tây Ban Nha, và mưa sao băng Perseids đạt cực đại vào ban đêm.",
    publishedAt: new Date("2026-08-12"),
  },
  {
    title: "Mưa sao băng Geminids 2026 dự báo đạt cực đại 100-150 vệt mỗi giờ",
    sourceUrl: "https://www.24h.com.vn/cong-nghe-thong-tin/cac-su-kien-thien-van-ky-thu-2026-c55a1726266.html",
    sourceName: "24h.com.vn",
    summary:
      "Trận mưa sao băng lớn nhất năm 2026, Geminids, dự kiến đạt cực đại vào đêm 13 rạng sáng 14/12 với mật độ có thể lên tới 100-150 vệt/giờ. Năm nay Mặt Trăng lặn sớm nên hầu như không ảnh hưởng đến điều kiện quan sát.",
    publishedAt: new Date("2026-08-01"),
  },
];

async function importNews() {
  await connectDB();

  const counters = { created: 0, updated: 0 };

  for (const article of NEWS_ARTICLES) {
    console.log(`[Import] Đang xử lý: ${article.title}...`);

    const result = await NewsArticle.findOneAndUpdate(
      { title: article.title },
      { $set: article },
      { upsert: true, new: true, rawResult: true },
    );

    if (result.lastErrorObject?.updatedExisting) {
      counters.updated++;
    } else {
      counters.created++;
    }
  }

  const total = counters.created + counters.updated;
  console.log(
    `\n[Import] Hoàn tất! Tổng: ${total} (tạo mới: ${counters.created}, cập nhật: ${counters.updated})`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

importNews().catch((err) => {
  console.error("[Import] Lỗi:", err);
  process.exit(1);
});