import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiMinimize2,
  FiMaximize2,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { useChat } from "../../Context/ChatContext";

const ChatWidget = () => {
  const {
    messages,
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    isLoading,
    sendMessage,
    clearChat,
  } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const quickActions = [
    { label: "View Bills", query: "Show me my recent bills" },
    { label: "Spending Tips", query: "Give me tips to reduce my bills" },
    { label: "How to pay?", query: "How do I pay a bill?" },
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 text-black rounded-full shadow-2xl hover:bg-emerald-400 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMessageCircle className="w-6 h-6" />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] shadow-2xl rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    SmartBills Assistant
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {isLoading ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition"
                >
                  {isMinimized ? (
                    <FiMaximize2
                      className="w-4 h-4"
                      style={{ color: "var(--text-primary)" }}
                    />
                  ) : (
                    <FiMinimize2
                      className="w-4 h-4"
                      style={{ color: "var(--text-primary)" }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition"
                >
                  <FiX
                    className="w-4 h-4"
                    style={{ color: "var(--text-primary)" }}
                  />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMessageCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p
                        className="font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Hi! I'm your SmartBills assistant
                      </p>
                      <p
                        className="text-sm px-4"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Ask me anything about your bills, payments, or how to
                        use SmartBills
                      </p>

                      {/* Quick Actions */}
                      <div className="mt-4 space-y-2">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(action.query)}
                            className="w-full px-4 py-2 text-sm rounded-lg border transition hover:bg-emerald-500/10"
                            style={{
                              borderColor: "rgba(255,255,255,0.1)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <FiMessageCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] ${
                            msg.role === "user" ? "order-first" : ""
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              msg.role === "user"
                                ? "bg-emerald-500 text-black"
                                : "border"
                            }`}
                            style={
                              msg.role === "assistant"
                                ? {
                                    backgroundColor: "var(--bg-secondary)",
                                    borderColor: "rgba(255,255,255,0.1)",
                                    color: "var(--text-primary)",
                                  }
                                : {}
                            }
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>

                          {/* Suggestions */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                  className="block w-full text-left text-xs px-3 py-1.5 rounded-lg border hover:bg-emerald-500/20 transition"
                                  style={{
                                    borderColor: "rgba(255,255,255,0.1)",
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  💡 {suggestion}
                                </button>
                              ))}
                            </div>
                          )}

                          <p
                            className="text-xs mt-1 px-2"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>

                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <FiUser className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div
                        className="max-w-[80%] rounded-2xl px-4 py-2 border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                          <span
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <span
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSubmit}
                  className="border-t p-4"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>

                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="mt-2 text-xs flex items-center gap-1 hover:text-red-500 transition"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Clear chat
                    </button>
                  )}

                  <p
                    className="text-xs text-center mt-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    🔒 Conversations are processed securely
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
