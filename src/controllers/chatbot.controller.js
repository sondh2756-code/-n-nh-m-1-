import ChatHistory from "../models/ChatHistory.js";
import { getChatbotReply } from "../services/gemini.service.js";

// POST /chatbot/message - Gui cau hoi cho chatbot, nhan cau tra loi (chuc nang 2)
export async function sendMessage(req, res, next) {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Noi dung tin nhan khong duoc de trong" });
    }

    let conversation = null;
    if (conversationId) {
      conversation = await ChatHistory.findById(conversationId);
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
      return res.status(404).json({ message: "Khong tim thay hoi thoai" });
    }

    // Chi cho xem hoi thoai cua chinh minh
    if (conversation.userId && String(conversation.userId) !== String(req.user?.id)) {
      return res.status(403).json({ message: "Ban khong co quyen xem hoi thoai nay" });
    }

    res.json({ messages: conversation.messages });
  } catch (err) {
    next(err);
  }
}
