import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

const SYSTEM_PROMPT = `Ban la mot tro ly AI chuyen ve thien van hoc cho website CosmoVision.
Tra loi ngan gon, de hieu, chinh xac ve khoa hoc. Neu cau hoi khong lien quan thien van
thi hay lich su goi y nguoi dung quay lai chu de thien van.`;

// Dung cho POST /chatbot/message - chuc nang 2 (Chatbot thien van AI)
export async function getChatbotReply(message, history = []) {
  // Gemini can lich su o dang { role: "user"|"model", parts: [{text}] }
  // Luu y: role trong DB cua minh la "assistant", Gemini goi la "model"
  const geminiHistory = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Tìm đến hàm getChatbotReply trong file của bạn và sửa:

  const chat = model.startChat({
    history: geminiHistory,
    // ĐỔI TỪ: systemInstruction: SYSTEM_PROMPT
    // THÀNH ĐỊNH DẠNG ĐÚNG CHUẨN ĐỐI TƯỢNG (OBJECT):
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

// Dung cho GET /planets/search - chuc nang 4 (Tim kiem thong minh)
// Chuyen cau hoi ngon ngu tu nhien thanh dieu kien loc MongoDB
export async function parseSearchIntent(query) {
  const prompt = `Chuyen cau hoi tim kiem hanh tinh sau thanh JSON filter.
Chi tra ve JSON, khong giai thich them. Vi du dinh dang: {"hasRing": true, "keyword": "sao"}

Cau hoi: ${query}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  try {
    return JSON.parse(result.response.text());
  } catch (e) {
    return {};
  }
}

// Dung cho GET /news/summary - chuc nang 6 (Tom tat tin tuc AI)
export async function summarizeArticle(title, content) {
  const prompt = `Tom tat bai bao thien van hoc sau trong 2-3 cau, tieng Viet, ngan gon.

Tieu de: ${title}

Noi dung: ${content}`;

  // Đổi cách truyền chuỗi prompt đơn lẻ thành Object cấu trúc contents
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text();
}

// Dung cho AI-generated interesting facts - chuc nang 1
export async function generatePlanetFunFacts(planetName) {
  const prompt = `Cho toi 3 su that thu vi ngan gon ve ${planetName}, tra ve dang JSON array of strings, tieng Viet.
Vi du: {"facts": ["su that 1", "su that 2", "su that 3"]}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  try {
    const parsed = JSON.parse(result.response.text());
    return Array.isArray(parsed) ? parsed : parsed.facts || [];
  } catch (e) {
    return [];
  }
}
