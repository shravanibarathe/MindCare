// ChatContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext"; // adjust path if needed
import type { EmotionType } from "../lib/supabase";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  emotion?: EmotionType;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * Utility to build storage key per-user.
 * If no userId provided, uses a 'guest' key.
 */
const storageKeyFor = (userId?: string | null) =>
  `mindcare_chat_${userId ?? "guest"}`;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages when user changes (login/logout/switch)
  useEffect(() => {
    try {
      const key = storageKeyFor(user?.id);
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      // ensure parsed is an array
      setMessages(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Failed to load chat messages from localStorage:", err);
      setMessages([]);
    }
  }, [user?.id]);

  // Persist messages whenever they change (to the user's key)
  useEffect(() => {
    try {
      const key = storageKeyFor(user?.id);
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (err) {
      console.error("Failed to save chat messages to localStorage:", err);
    }
  }, [messages, user?.id]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearMessages = () => {
    setMessages([]);
    // also remove from localStorage for current user
    try {
      const key = storageKeyFor(user?.id);
      localStorage.removeItem(key);
    } catch (err) {
      console.error("Failed to remove chat messages from localStorage:", err);
    }
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
