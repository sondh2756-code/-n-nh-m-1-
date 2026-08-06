import mongoose from "mongoose";

// Schema con - dinh nghia cau truc cho TUNG tin nhan ben trong mang messages
const messageSchema = new mongoose.Schema(
  {
    role: {
      // vai tro cua nguoi gui: "user" (nguoi dung) hoac "assistant" (chatbot AI)
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      // noi dung tin nhan
      type: String,
      required: true,
    },
    timestamp: {
      // thoi diem gui tin nhan
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // khong can _id rieng cho tung tin nhan, do khong query truc tiep
);

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      // tham chieu toi User; de null neu la khach (guest) chua dang nhap
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    messages: {
      // danh sach toan bo tin nhan trong 1 cuoc hoi thoai (dang JSON)
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  }
);

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;
