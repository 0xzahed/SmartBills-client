import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import { API_BASE_URL } from "../config";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load chat history from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("chatHistory");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/chat`,
        {
          message: text,
          email: user?.email,
          history: messages.slice(-5), // Send last 5 messages for context
        },
        {
          headers: {
            "x-user-email": user?.email || "",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.data.response,
        suggestions: response.data.suggestions || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      let errorText = "Sorry, I'm having trouble connecting. Please try again.";
      let debugInfo = "";

      if (error.response) {
        // Server responded with error
        console.error("Server error:", error.response.data);
        console.error("Status:", error.response.status);
        errorText =
          error.response.data.error || error.response.data.message || errorText;
        debugInfo = `\n\nError: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`;
      } else if (error.request) {
        // Request made but no response
        errorText = "Cannot reach the server. Please check your connection.";
        debugInfo =
          "\n\nThe backend server is not responding. Check if:\n1. Backend is deployed on Vercel\n2. GROQ_API_KEY is set\n3. Dependencies are installed (groq-sdk)";
      } else {
        debugInfo = `\n\nError: ${error.message}`;
      }

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: errorText + debugInfo,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chatHistory");
  };

  const value = {
    messages,
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    isLoading,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
