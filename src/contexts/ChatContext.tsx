import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { EmotionType } from "../lib/supabase"; // emotion type support

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  emotion?: EmotionType; // FIXED
}

interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("mindcare_chat");
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save messages
  useEffect(() => {
    localStorage.setItem("mindcare_chat", JSON.stringify(messages));
  }, [messages]);

  // OPTIONAL: Auto-delete messages older than 30 days (disabled by default)
  /*
  useEffect(() => {
    const filtered = messages.filter((msg) => {
      const diff = Date.now() - new Date(msg.timestamp).getTime();
      return diff < 30 * 24 * 60 * 60 * 1000; // 30 days
    });

    if (filtered.length !== messages.length) {
      setMessages(filtered);
    }
  }, []);
  */

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
