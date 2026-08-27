import ChatHistory from "../models/ChatHistory.js";
import { getChatbotReply } from "../services/gemini.service.js";

// POST /chatbot/message - Gui cau hoi cho chatbot, nhan cau tra loi (chuc nang 2)
export async function sendMessage(req, res, next) {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res
        .status(400)
        .json({ message: "Nội dung tin nhắn không được để trống" });
    }

    let conversation = null;
    if (conversationId) {
      conversation = await ChatHistory.findById(conversationId);
      if (
        conversation?.userId &&
        String(conversation.userId) !== String(req.user?.id)
      ) {
        conversation = null;
      }
    }

    if (!conversation) {
      conversation = await ChatHistory.create({
        userId: req.user?.id || null,
        messages: [],
      });
    }

    const reply = await getChatbotReply(message, conversation.messages);

    conversation.messages.push({ role: "user", content: message });
    conversation.messages.push({ role: "assistant", content: reply });
    await conversation.save();

    res.json({ reply, conversationId: conversation._id });
  } catch (err) {
    next(err);
  }
}

// GET /chatbot/history/:conversationId - Lay lich su hoi thoai
export async function getHistory(req, res, next) {
  try {
    const conversation = await ChatHistory.findById(req.params.conversationId);

    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    // Chi cho xem hoi thoai cua chinh minh
    if (
      conversation.userId &&
      String(conversation.userId) !== String(req.user?.id)
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem cuộc trò chuyện này" });
    }

    res.json({ messages: conversation.messages });
  } catch (err) {
    next(err);
  }
}

// GET /chatbot/history - Lay danh sach cac cuoc hoi thoai cua nguoi dung
export async function listHistories(req, res, next) {
  try {
    const conversations = await ChatHistory.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select("messages updatedAt createdAt")
      .limit(30)
      .lean();

    res.json({
      conversations: conversations.map((conversation) => ({
        id: conversation._id,
        title:
          conversation.messages?.find((message) => message.role === "user")
            ?.content || "Cuoc tro chuyen moi",
        preview:
          conversation.messages?.[conversation.messages.length - 1]?.content ||
          "Chưa có tin nhắn",
        updatedAt: conversation.updatedAt || conversation.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}
