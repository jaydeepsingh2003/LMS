"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "ai";
  content: string;
}

export default function ChatMessage({ role, content }: MessageProps) {
  const isAi = role === "ai";

  return (
    <motion.div 
      initial={{ opacity: 0, x: isAi ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex gap-3 mb-4",
        !isAi && "flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
        isAi ? "bg-purple-600 text-white" : "bg-accent text-black"
      )}>
        {isAi ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className={cn(
        "max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-lg backdrop-blur-md relative",
        isAi 
          ? "bg-white/[0.03] border-white/10 text-gray-200 rounded-tl-none shadow-purple-500/5 group" 
          : "bg-accent/10 border-accent/20 text-white rounded-tr-none shadow-accent/5"
      )}>
        {isAi && (
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        <div className="whitespace-pre-wrap relative z-10">{content}</div>
        {isAi && (
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold tracking-widest text-purple-400">KodNest AI Assistant</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
