// Import du lieu su kien thien van (mua sao bang, nguyet thuc, doi dinh
// hanh tinh, giao hoi...) vao MongoDB.
// Du lieu duoc tong hop tu Hoi Thien van Ha Noi (HAS), VACA va cac nguon
// thien van uy tin cho nam 2026, uu tien cac su kien QUAN SAT DUOC tai
// Viet Nam. Ban nen cap nhat lai moi nam.
//
// Chay: node src/utils/importSkyEvents.js

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import SkyEvent from "../models/SkyEvent.js";

const SKY_EVENTS = [
  {
    eventName: "Sao Hải Vương ở vị trí trực đối (đối đỉnh)",
    date: new Date("2026-09-25"),
    visibilityRegion: "Toàn cầu (cần kính thiên văn)",
    description:
      "Sao Hải Vương ở vị trí đối diện Mặt Trời khi nhìn từ Trái Đất, sáng và gần Trái Đất nhất trong năm. Do rất mờ (độ sáng biểu kiến khoảng 7.8), cần kính thiên văn hoặc ống nhòm mạnh để quan sát, không thể nhìn bằng mắt thường.",
  },
  {
    eventName: "Trăng lưỡi liềm cuối tháng gần Sao Kim",
    date: new Date("2026-09-07"),
    visibilityRegion: "Việt Nam (rạng sáng, chân trời phía Đông)",
    description:
      "Rạng sáng, nếu trời trong, trăng lưỡi liềm mảnh xuất hiện gần Sao Kim ở chân trời phía Đông trước bình minh, tạo khung cảnh đẹp để quan sát và chụp ảnh bằng mắt thường.",
  },
  {
    eventName: "Sao Thổ ở vị trí trực đối (đối đỉnh)",
    date: new Date("2026-10-04"),
    visibilityRegion: "Toàn cầu (mắt thường thấy chấm sáng, cần kính để thấy vành đai)",
    description:
      "Sao Thổ ở vị trí đối diện Mặt Trời, mọc lúc hoàng hôn và lặn lúc bình minh, sáng và lớn nhất trong năm. Đây là thời điểm tốt nhất năm để quan sát vành đai Sao Thổ qua kính thiên văn nghiệp dư.",
  },
  {
    eventName: "Mưa sao băng Orionids cực đại",
    date: new Date("2026-10-21"),
    visibilityRegion: "Việt Nam (sau nửa đêm đến trước bình minh)",
    description:
      "Mưa sao băng do tàn dư sao chổi Halley để lại, tâm điểm ở chòm sao Lạp Hộ (Orion). Mật độ trung bình khoảng 15-20 vệt/giờ trong điều kiện lý tưởng, quan sát tốt nhất ở nơi tối, ít ánh đèn.",
  },
  {
    eventName: "Mặt Trăng che khuất Sao Mộc trong thời gian ngắn",
    date: new Date("2026-10-15"),
    visibilityRegion: "Một số khu vực (tùy vị trí địa lý)",
    description:
      "Mặt Trăng đi ngang qua và che khuất Sao Mộc trong thời gian ngắn. Hiện tượng thú vị để quan sát qua kính thiên văn hoặc ống nhòm, thời điểm và khả năng quan sát phụ thuộc vào vị trí người xem.",
  },
  {
    eventName: "Mặt Trăng và Sao Mộc tiến sát nhau",
    date: new Date("2026-11-02"),
    visibilityRegion: "Việt Nam (bầu trời phía Đông, ban đêm)",
    description:
      "Mặt Trăng và Sao Mộc tiến rất gần nhau trên bầu trời phía Đông, tạo khung cảnh nổi bật dễ quan sát bằng mắt thường, đẹp hơn khi dùng ống nhòm.",
  },
  {
    eventName: "Sao Hỏa xuất hiện gần Sao Mộc",
    date: new Date("2026-11-16"),
    visibilityRegion: "Việt Nam (rạng sáng, chân trời phía Đông)",
    description:
      "Rạng sáng, ánh đỏ của Sao Hỏa xuất hiện gần Sao Mộc, tạo thành cặp hành tinh sáng nổi bật cạnh nhau trên bầu trời, quan sát tốt bằng mắt thường.",
  },
  {
    eventName: "Mưa sao băng Taurids hoạt động mạnh",
    date: new Date("2026-11-12"),
    visibilityRegion: "Việt Nam (ban đêm, ít vệt nhưng sáng và chậm)",
    description:
      "Mưa sao băng Taurids có mật độ thấp nhưng các vệt sao băng thường sáng, chậm và dễ quan sát, tâm điểm ở chòm sao Kim Ngưu (Taurus).",
  },
  {
    eventName: "Siêu Trăng tháng 11",
    date: new Date("2026-11-24"),
    visibilityRegion: "Toàn cầu, quan sát được tại Việt Nam",
    description:
      "Trăng tròn trùng thời điểm Mặt Trăng gần Trái Đất, khiến Mặt Trăng trông lớn và sáng hơn bình thường. Một trong ba lần siêu Trăng của năm 2026.",
  },
  {
    eventName: "Sao Thiên Vương ở vị trí trực đối (đối đỉnh)",
    date: new Date("2026-11-25"),
    visibilityRegion: "Toàn cầu (cần ống nhòm/kính thiên văn)",
    description:
      "Sao Thiên Vương ở vị trí đối diện Mặt Trời, sáng và gần Trái Đất nhất trong năm nhưng vẫn rất mờ (độ sáng biểu kiến khoảng 5.6), cần bầu trời tối và ống nhòm hoặc kính thiên văn để quan sát.",
  },
  {
    eventName: "Mưa sao băng Geminids cực đại",
    date: new Date("2026-12-14"),
    visibilityRegion: "Việt Nam (toàn bộ đêm, đẹp nhất sau nửa đêm)",
    description:
      "Trận mưa sao băng lớn nhất năm, tâm điểm ở chòm sao Song Tử (Gemini). Cực điểm rơi vào đêm 13, rạng sáng 14 tháng 12, có thể đạt 100-150 vệt/giờ trong điều kiện lý tưởng. Năm 2026 Mặt Trăng lặn sớm nên gần như không ảnh hưởng đến việc quan sát.",
  },
  {
    eventName: "Siêu Trăng tháng 12 (Trăng lạnh)",
    date: new Date("2026-12-23"),
    visibilityRegion: "Toàn cầu, quan sát được tại Việt Nam",
    description:
      "Siêu Trăng cuối cùng trong ba lần siêu Trăng của năm 2026, còn gọi là Trăng Lạnh (Cold Moon) theo cách gọi dân gian phương Tây.",
  },
  {
    eventName: "Mưa sao băng Ursids cực đại",
    date: new Date("2026-12-22"),
    visibilityRegion: "Việt Nam (sau nửa đêm, mật độ thấp)",
    description:
      "Trận mưa sao băng nhỏ khép lại năm, tâm điểm ở chòm sao Tiểu Hùng (Ursa Minor), mật độ khiêm tốn khoảng 5-10 vệt/giờ nhưng là dịp đẹp để ngắm bầu trời mùa đông.",
  },
];

async function importSkyEvents() {
  await connectDB();

  const counters = { created: 0, updated: 0 };

  for (const event of SKY_EVENTS) {
    console.log(`[Import] Đang xử lý: ${event.eventName}...`);

    const result = await SkyEvent.findOneAndUpdate(
      { eventName: event.eventName, date: event.date },
      { $set: event },
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

importSkyEvents().catch((err) => {
  console.error("[Import] Lỗi:", err);
  process.exit(1);
});