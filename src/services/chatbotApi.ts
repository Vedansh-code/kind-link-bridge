import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://kind-link-bridge-backend-1.onrender.com";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatTextPayload {
  user_id: string | number;
  user_name: string;
  message: string;
  chat_history: ChatMessage[];
}

export const sendTextChat = async (payload: ChatTextPayload): Promise<ChatMessage> => {
  const response = await axios.post(`${API_BASE_URL}/api/chatbot/text`, payload);
  // Support variations in response keys: reply, content, message
  const replyContent = response.data.reply || response.data.content || response.data.message || response.data;
  return {
    role: "assistant",
    content: typeof replyContent === "string" ? replyContent : JSON.stringify(replyContent),
  };
};

export const sendVoiceChat = async (
  userId: string | number,
  userName: string,
  audioBlob: Blob,
  chatHistory: ChatMessage[]
): Promise<ChatMessage> => {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, "voice_recording.webm");
  formData.append("chat_history_str", JSON.stringify(chatHistory));
  formData.append("user_id", String(userId));
  formData.append("user_name", userName);

  const response = await axios.post(`${API_BASE_URL}/api/chatbot/voice`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const replyContent = response.data.reply || response.data.content || response.data.message || response.data;
  return {
    role: "assistant",
    content: typeof replyContent === "string" ? replyContent : JSON.stringify(replyContent),
  };
};
