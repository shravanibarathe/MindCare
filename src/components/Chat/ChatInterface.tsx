import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useEmotion } from "../../contexts/EmotionContext";
import { useChat } from "../../contexts/ChatContext";
import type { EmotionType } from "../../lib/supabase";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  emotion?: EmotionType;
  timestamp: string; // FIXED
}

const BACKEND_URL = "http://localhost:5000";

export function ChatInterface() {
  const { messages, addMessage } = useChat();
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { setEmotion, emotionTheme } = useEmotion();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeText = async (text: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          user_id: user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze text");

      return await response.json();
    } catch (error) {
      console.error("Error analyzing text:", error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString(), // FIXED
    };

    addMessage(userMessage);
    setInputText("");
    setIsLoading(true);

    const result = await analyzeText(inputText);

    if (result) {
      setEmotion(result.emotion as EmotionType);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: "ai",
        emotion: result.emotion as EmotionType,
        timestamp: new Date().toISOString(), // FIXED
      };

      addMessage(aiMessage);
    } else {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          "I'm having trouble connecting right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date().toISOString(), // FIXED
      };

      addMessage(aiMessage);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                  : "bg-white border-2 shadow-md"
              }`}
              style={
                message.sender === "ai"
                  ? {
                      borderColor: emotionTheme.primary,
                      color: emotionTheme.text,
                    }
                  : {}
              }
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === "user"
                    ? "text-white/70"
                    : "opacity-60"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3 bg-white border-2 shadow-md"
              style={{ borderColor: emotionTheme.primary }}
            >
              <div className="flex items-center space-x-2">
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: emotionTheme.primary }}
                />
                <span className="text-sm" style={{ color: emotionTheme.text }}>
                  Understanding...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-end space-x-2">
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent resize-none transition-all"
              style={{ focusRing: emotionTheme.primary }}
              rows={1}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
            style={{ background: emotionTheme.primary }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
