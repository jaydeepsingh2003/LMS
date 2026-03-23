"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, X, Send, Bot } from "lucide-react";
import apiClient from "@/lib/apiClient";
import ChatMessage from "./ChatMessage";
import { cn } from "@/lib/utils";

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMsg = question.trim();
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await apiClient.post("/ai/ask", {
        question: userMsg,
        context: "The user is currently on their personal learning dashboard."
      });
      setChatHistory(prev => [...prev, { role: "ai", content: response.data.answer }]);
    } catch (err) {
      console.error("AI Assistant Error:", err);
      setChatHistory(prev => [...prev, { role: "ai", content: "I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(20px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="w-[380px] h-[550px] glass-card-premium flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 rounded-[2.5rem]"
          >
            {/* Header: Concise Industrial Style */}
            <div className="p-8 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center shadow-[0_8px_25px_rgba(147,51,234,0.4)] relative group">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <Bot className="w-6 h-6 text-white relative z-10" />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight text-white leading-none">AI Assistant</h3>
                   <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[9px] text-gray-500 font-bold tracking-widest leading-none">AI is ready</p>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-500 hover:text-white flex items-center justify-center group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide bg-[#080808]/40"
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 px-8">
                  <div className="w-16 h-16 rounded-3xl bg-purple-500/5 flex items-center justify-center border border-purple-500/10">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black tracking-widest text-white">Ready to help</p>
                    <p className="text-[11px] font-medium leading-relaxed italic text-gray-600">I am ready. Ask me anything about your courses.</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} />
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 p-4 bg-white/[0.02] rounded-2xl w-fit ml-4 border border-white/5">
                   <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAsk} className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-xl">
              <div className="relative flex items-center gap-3">
                <div className="relative flex-1 group">
                  <input 
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-6 pr-6 text-[12px] font-medium text-white focus:outline-none focus:border-purple-500/30 transition-all placeholder:text-gray-700"
                    disabled={loading}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl text-white hover:brightness-110 disabled:opacity-20 transition-all shadow-[0_10px_30px_rgba(147,51,234,0.3)] flex items-center justify-center active:scale-90 group shrink-0"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle: Sleek Circular Industrial Style */}
      <motion.button
        whileHover={{ y: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border transition-all duration-500 relative group overflow-hidden",
          isOpen 
            ? "bg-white text-black border-white" 
            : "bg-black text-white border-white/10"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <div className="relative z-10">
            <Bot className="w-7 h-7 group-hover:scale-110 transition-transform duration-500" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
