import { createContext, useContext, useEffect, useRef, useState } from "react";
import { chatbotApi } from "./client";
import { useAuth } from "./AuthContext";

const CHAT_MESSAGES_KEY = "cosmovision-chat-messages";
const CHAT_CONVERSATION_KEY = "cosmovision-chat-conversation";

const DEFAULT_MESSAGE = {
  role: "assistant",
  content:
    "Chào bạn!! Mình là CosmoAI! Bạn muốn biết gì về vũ trụ ngày hôm nay??",
};

const ChatContext = createContext(null);

function loadMessages() {
  try {
    const savedMessages = JSON.parse(localStorage.getItem(CHAT_MESSAGES_KEY));
    return Array.isArray(savedMessages) && savedMessages.length > 0
      ? savedMessages
      : [DEFAULT_MESSAGE];
  } catch {
    return [DEFAULT_MESSAGE];
  }
}

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(loadMessages);
  const [conversationId, setConversationId] = useState(() =>
    localStorage.getItem(CHAT_CONVERSATION_KEY),
  );
  const [histories, setHistories] = useState([]);
  const [sending, setSending] = useState(false);
  const activeRequest = useRef(false);

  useEffect(() => {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(CHAT_CONVERSATION_KEY, conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!user) {
      setHistories([]);
      return;
    }

    chatbotApi
      .listHistories()
      .then((data) => setHistories(data.conversations || []))
      .catch(() => setHistories([]));
  }, [user]);

  useEffect(() => {
    if (!user || !conversationId) return;

    chatbotApi
      .getHistory(conversationId)
      .then((data) => {
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        // Giữ bản lưu cục bộ nếu lịch sử server không còn khả dụng.
      });
  }, [user, conversationId]);

  async function openConversation(id) {
    if (!id || id === conversationId || sending) return;

    const data = await chatbotApi.getHistory(id);
    setConversationId(id);
    setMessages(data.messages?.length ? data.messages : [DEFAULT_MESSAGE]);
  }

  function startNewConversation() {
    if (sending) return;
    setConversationId(null);
    localStorage.removeItem(CHAT_CONVERSATION_KEY);
    setMessages([DEFAULT_MESSAGE]);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || activeRequest.current) return;

    activeRequest.current = true;
    setMessages((previous) => [
      ...previous,
      { role: "user", content: trimmed },
    ]);
    setSending(true);

    try {
      const data = await chatbotApi.sendMessage(trimmed, conversationId);
      setConversationId(data.conversationId);
      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
      if (user) {
        chatbotApi
          .listHistories()
          .then((historyData) => setHistories(historyData.conversations || []))
          .catch(() => {});
      }
    } catch (err) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: `Xin lỗi, mình gặp lỗi: ${err.message}. Kiểm tra GEMINI_API_KEY trong .env của backend.`,
        },
      ]);
    } finally {
      activeRequest.current = false;
      setSending(false);
    }
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        sending,
        histories,
        conversationId,
        sendMessage,
        openConversation,
        startNewConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat phải dùng bên trong ChatProvider");
  return context;
}
