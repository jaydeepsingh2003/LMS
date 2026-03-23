"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      setAuth(response.data.user, response.data.accessToken);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Check your data link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#050505] selection:bg-accent selection:text-black overflow-hidden">
      {/* Left: Cinematic Visual - The Designer Touch */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block relative p-20 flex flex-col justify-between overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
          alt="Abstract Digital"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-purple-900/40 to-black z-10" />
        
        <div className="relative z-20 flex items-center gap-3">
          <LogIn className="w-10 h-10 text-accent" />
          <span className="text-3xl font-black tracking-tighter text-white">KODNEST</span>
          <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">LOGIN</span>
        </div>

        <div className="relative z-20 space-y-6">
          <h2 className="text-7xl font-black tracking-tighter text-white leading-[0.85]">Learn and <br /> <span className="text-accent">Grow.</span></h2>
          <p className="text-gray-400 text-lg font-medium max-w-md leading-relaxed">
            Log in to your account and continue learning engineering today.
          </p>
        </div>

        <div className="relative z-20 flex items-center gap-6">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md">
            <LogIn className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Secure student portal</p>
        </div>
      </motion.div>

      {/* Right: Premium Form Area */}
      <section className="relative p-8 md:p-20 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-black text-[9px] font-black uppercase tracking-widest"
            >
              Login required
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter text-white">Student Login</h1>
            <p className="text-gray-500 font-medium">Access your student dashboard and course progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-medium focus:outline-none focus:border-accent/40 focus:bg-white/5 transition-all outline-none"
                    placeholder="student@kodnest.node"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-medium focus:outline-none focus:border-accent/40 focus:bg-white/5 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full h-20 shadow-[0_20px_40px_rgba(255,184,0,0.2)]"
            >
              {loading ? "Logging in..." : <>Sign in <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="pt-10 flex flex-col gap-6 text-center lg:text-left">
            <p className="text-sm font-medium text-gray-500">
              <Link href="/auth/register" className="text-accent hover:text-white transition-colors font-black uppercase tracking-widest italic ml-2">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
