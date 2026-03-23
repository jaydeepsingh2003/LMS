"use client";

import Link from "next/link";
import { Layout } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function SharedNavbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] border-b border-white/5 bg-black/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-all">
          <Layout className="w-8 h-8 text-accent shadow-glow" />
          <span className="text-2xl font-black tracking-[-0.04em] leading-none text-white">KodNest<span className="text-accent">.</span></span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-1 pl-1">LMS</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="/#subjects" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-accent transition-colors">Courses</Link>
          <Link href="/dashboard" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-accent transition-colors">Dashboard</Link>
          <Link href="#" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-accent transition-colors">Community</Link>
        </div>

        <div className="flex items-center gap-4 min-w-[120px] justify-end">
          {!mounted ? (
            <div className="w-24 h-8 bg-white/5 rounded-full animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-gray-600 italic">Active student</p>
                <p className="text-sm font-black text-white">{user?.name}</p>
              </div>
              <button 
                onClick={logout}
                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500 transition-all"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-white px-4">Login</Link>
              <Link href="/auth/register" className="px-7 py-3 bg-white text-black rounded-full text-[10px] font-black tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                Join now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
