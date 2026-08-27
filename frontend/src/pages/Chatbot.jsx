import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useChat } from "../api/ChatContext";
import ReactMarkdown from "react-markdown";

const SUGGESTED_QUESTIONS = [
  "Hành tinh nào dễ quan sát nhất tối nay?",
  "Giải thích hố đen là gì?",
  "Tôi nên mua kính viễn vọng nào?",
];

export default function Chatbot() {
  const {
    messages,
    sending,
    sendMessage,
    histories,
    conversationId,
    openConversation,
    startNewConversation,
  } = useChat();
  const [input, setInput] = useState("");
  const [historyError, setHistoryError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const message = input;
    setInput("");
    sendMessage(message);
  }

  async function handleOpenConversation(id) {
    try {
      setHistoryError("");
      await openConversation(id);
    } catch (err) {
      setHistoryError(err.message || "Không tải được lịch sử trò chuyện");
    }
  }

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-gutter h-[calc(100vh-190px)] min-h-[560px]">
          <aside className="glass-panel w-full md:w-64 shrink-0 rounded-xl p-4 flex flex-col max-h-48 md:max-h-none overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <p className="font-label-caps text-label-caps text-primary">
                  COSMO AI
                </p>
                <h2 className="font-headline-lg-mobile text-[20px] text-on-surface">
                  Lịch sử chat
                </h2>
              </div>
              <button
                type="button"
                onClick={startNewConversation}
                disabled={sending}
                aria-label="Tạo cuộc trò chuyện mới"
                className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">add_comment</span>
              </button>
            </div>
            {historyError && (
              <p className="text-xs text-error mb-2">{historyError}</p>
            )}
            <div className="flex flex-col gap-2 overflow-y-auto">
              {histories.map((history) => (
                <button
                  key={history.id}
                  type="button"
                  onClick={() => handleOpenConversation(history.id)}
                  className={`text-left rounded-lg p-3 border transition-colors ${
                    conversationId === history.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="block text-sm font-semibold text-on-surface truncate">
                    {history.title}
                  </span>
                  <span className="block text-xs text-on-surface-variant truncate mt-1">
                    {history.preview}
                  </span>
                  <span className="block text-[10px] text-primary mt-2">
                    {history.updatedAt
                      ? new Date(history.updatedAt).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </button>
              ))}
              {histories.length === 0 && (
                <p className="text-sm text-on-surface-variant py-3">
                  Đăng nhập để xem các cuộc trò chuyện đã lưu.
                </p>
              )}
            </div>
          </aside>

          <div className="glass-panel w-full min-w-0 rounded-xl flex flex-col flex-1 shadow-[0px_4px_24px_rgba(var(--primary),0.15)] overflow-hidden relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4 bg-surface-container-high/50">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-surface-variant border border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.4)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    smart_toy
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-surface shadow-[0_0_8px_rgba(250,189,0,0.8)]" />
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface m-0">
                  CosmoAI
                </h2>
                <p className="font-label-caps text-label-caps text-primary/80 m-0">
                  Online • Powered by Gemini
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 flex flex-col gap-6"
            >
              {messages.map((msg, i) =>
                msg.role === "assistant" ? (
                  <div key={i} className="flex gap-4 items-start max-w-[85%]">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-surface-variant flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        smart_toy
                      </span>
                    </div>
                    <div className="chat-bubble-bot p-4 rounded-xl rounded-bl-sm text-on-surface font-body-md text-body-md shadow-md border border-white/5 bg-surface-container-high">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex gap-4 items-start self-end max-w-[85%] flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center flex-shrink-0 mt-1 border border-white/10">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">
                        person
                      </span>
                    </div>
                    <div className="p-4 rounded-xl rounded-br-sm text-on-primary-container font-body-md text-body-md shadow-[0_4px_12px_rgba(var(--primary),0.3)] bg-gradient-to-br from-primary-container to-secondary-container">
                      {msg.content}
                    </div>
                  </div>
                ),
              )}
              {sending && (
                <div className="flex gap-4 items-start max-w-[85%]">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-surface-variant flex items-center justify-center mt-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      smart_toy
                    </span>
                  </div>
                  <div className="chat-bubble-bot p-4 rounded-xl rounded-bl-sm bg-surface-container-high text-on-surface-variant text-sm">
                    Đang suy nghĩ...
                  </div>
                </div>
              )}
            </div>

            {/* Suggested questions */}
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar py-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex-shrink-0 font-label-caps text-label-caps bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/30 hover:border-primary transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/10 bg-surface-container-low/80"
            >
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg border-b border-primary/50 focus-within:border-primary transition-all duration-300">
                <input
                  className="flex-grow bg-transparent border-none text-on-surface font-body-md text-body-md focus:ring-0 placeholder-on-surface-variant/50 py-3 px-4 outline-none"
                  placeholder="Hoi CosmoAI ve vu tru..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="p-3 text-primary hover:text-tertiary transition-colors mr-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined filled">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
