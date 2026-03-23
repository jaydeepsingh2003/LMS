"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  Clock, 
  ChevronRight, 
  Trophy, 
  Star,
  Download,
  ExternalLink,
  ShieldCheck,
  Flame,
  Bot,
  Sparkles,
  Play,
  TrendingUp,
  Search,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import FloatingAiAssistant from "@/components/Ai/FloatingAiAssistant";

import SharedNavbar from "@/components/UI/SharedNavbar";
import { Skeleton } from "@/components/UI/Skeleton";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [dashSearch, setDashSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/users/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated, router]);

  if (loading) return (
    <div className="min-h-screen bg-black p-8 pt-32 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Skeleton className="lg:col-span-2 h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    </div>
  );

  const enrollments = profile?.enrollments || [];
  const completedCourses = enrollments.filter((e: any) => e.progress === 100);
  const realCertificates = profile?.user?.certificates || [];

  const stats = {
    coursesJoined: enrollments.length,
    hoursLearned: "12.5h", // Mock
    certificates: realCertificates.length,
    streak: "5 Days" // Mock
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-20 text-white selection:bg-accent/30 selection:text-white">
      <SharedNavbar />
      
      {/* Mesh Background */}
      <div className="mesh-background opacity-40 fixed inset-0 pointer-events-none" />

      {/* Cinematic Header Overlay - Balanced */}
      <div className="relative pt-36 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-accent/20 text-accent text-[10px] font-bold tracking-widest shadow-[0_0_40px_rgba(255,184,0,0.1)]">
                  <Flame className="w-4 h-4 animate-pulse" /> Your progress
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-tight text-white">
                  Track your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent via-orange-400 to-red-600">Learning.</span>
                </h1>
                <p className="text-lg text-gray-500 font-medium max-w-lg leading-relaxed border-l border-white/10 pl-6 italic">
                  Welcome back, <span className="text-white font-black">{user?.name}</span>. Your personal learning dashboard is ready.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="flex items-center gap-6"
              >
                <Link href="/" className="premium-button py-5 px-10 group h-16 text-[10px] font-bold tracking-widest">
                  <span className="relative z-10 flex items-center gap-3">
                    Explore courses <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                  </span>
                </Link>
                <button className="h-16 px-8 glass-card border-white/5 hover:border-white/20 transition-all font-bold tracking-widest text-[9px] text-gray-500 hover:text-white">
                  Settings
                </button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square w-full max-w-lg relative z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,184,0,0.2),transparent)] rounded-[4rem] blur-[80px] animate-pulse" />
                <div className="w-full h-full glass-card-premium border-white/10 rounded-[4rem] flex items-center justify-center p-12 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent group-hover:scale-150 transition-transform duration-[3s]" />
                   <div className="relative z-20 text-center space-y-6">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-orange-600 mx-auto p-1 shadow-[0_0_60px_rgba(255,184,0,0.4)]">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-4xl font-black text-accent uppercase tracking-tighter">
                          {user?.name?.[0]}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-black tracking-tight">{user?.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Professional Engineering Tier</p>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 glass-card rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                <ShieldCheck className="w-12 h-12 text-accent" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 glass-card rounded-2xl flex items-center justify-center shadow-2xl animate-float [animation-delay:2s]">
                <Bot className="w-10 h-10 text-purple-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-30">
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-20">
          
          {/* Ongoing Courses */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-accent font-bold tracking-wide text-[10px]">
                  <TrendingUp className="w-4 h-4" /> In progress
                </div>
                <h3 className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-none">My courses<span className="text-accent">.</span></h3>
              </div>
              
              <div className="relative w-full md:w-72 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-accent transition-all duration-300" />
                <input 
                  type="text" 
                  placeholder="Filter courses..." 
                  onChange={(e) => setDashSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-[10px] font-bold text-white focus:outline-none focus:border-accent/40 focus:bg-white/10 transition-all duration-500 placeholder:text-gray-700"
                />
              </div>
            </div>

            {enrollments.length === 0 ? (
              <div className="glass-card p-16 text-center space-y-6 border-dashed border-white/5 bg-white/[0.01]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8 text-gray-700" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold">Your journey hasn&apos;t started.</p>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">Enroll in your first subject to start tracking your progress and earning certificates.</p>
                </div>
                <Link href="/" className="premium-button inline-flex py-3 px-8 text-[10px] font-bold tracking-widest">Discover Subjects</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {enrollments.filter((course: any) => 
                  course.title.toLowerCase().includes(dashSearch.toLowerCase())
                ).map((course: any, idx: number) => (
                  <motion.div
                    key={course.subjectId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card-premium group relative min-h-[380px] flex flex-col justify-end p-10 overflow-hidden border-white/5 hover:border-accent/40 transition-all duration-1000 hover:shadow-[0_60px_150px_-50px_rgba(255,184,0,0.2)]"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    </div>

                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/30 transition-colors shadow-2xl">
                               <BookOpen className="w-6 h-6 text-accent shadow-[0_0_20px_rgba(255,184,0,0.3)]" />
                            </div>
                            <div>
                               <h4 className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors duration-500 leading-none mb-1">
                                 {course.title}
                               </h4>
                               <p className="text-[10px] font-bold text-gray-600 tracking-tight italic">Up to date</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                               <span className="text-3xl font-black text-white group-hover:text-accent transition-colors tabular-nums">{Math.round(course.progress)}</span>
                               <span className="text-xs font-black text-accent/50">%</span>
                            </div>
                            <p className="text-[9px] font-bold tracking-widest text-gray-700 mt-1">Overall progress</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-white/5">
                         {[
                           { label: "Videos watched", val: `${course.completedVideos} / ${course.totalVideos}`, icon: CheckCircle },
                           { label: "Status", val: course.progress >= 100 ? "Finished" : "Learning", icon: ShieldCheck },
                           { label: "Access level", val: "Industrial", icon: Trophy }
                         ].map((m, i) => (
                           <div key={i} className="space-y-1">
                              <p className="text-[10px] font-bold tracking-widest text-gray-700 flex items-center gap-2">
                                <m.icon className="w-3.5 h-3.5 text-accent/60" /> {m.label}
                              </p>
                              <p className="text-lg font-bold text-white tracking-tight">{m.val}</p>
                           </div>
                         ))}
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative p-0.5 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-gradient-to-r from-accent via-orange-500 to-accent rounded-full relative"
                          />
                        </div>
                        <Link 
                          href={`/subjects/${course.subjectId}`}
                          className="premium-button py-4 px-12 group h-14 text-[10px] font-bold tracking-widest whitespace-nowrap w-full md:w-auto text-center"
                        >
                          Continue learning <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-700" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Area: Multi-Column Bent Grid Layout */}
          <div className="space-y-10">
            
            {/* Real-time Performance Node */}
            <div className="glass-card-premium p-8 bg-gradient-to-b from-white/[0.03] to-transparent border-white/10 group overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,184,0,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Activity status</h3>
                    <p className="text-[9px] font-bold text-gray-600 mt-1 leading-none italic">Real-time activity</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-accent animate-pulse" />
                </div>
                
                <div className="space-y-4">
                   <div className="grid grid-cols-7 gap-2">
                      {[1,2,3,4,5,6,7].map((day) => (
                        <div 
                          key={day} 
                          className={cn(
                            "h-16 rounded-lg border border-white/5 cursor-pointer relative group/item",
                            day < 6 ? "bg-accent/20 border-accent/40" : "bg-white/5"
                          )}
                        />
                      ))}
                   </div>
                   <div className="flex items-center justify-between px-1">
                      <p className="text-[9px] font-bold tracking-widest text-gray-700">Mon</p>
                      <p className="text-[9px] font-bold tracking-widest text-accent italic">5 day streak</p>
                      <p className="text-[9px] font-bold tracking-widest text-gray-700">Sun</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Achievement Matrix */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-600 pl-4 border-l-2 border-accent/20">Your certificates</h3>
              <div className="grid grid-cols-1 gap-4">
                {realCertificates.length === 0 ? (
                  <div className="glass-card p-10 border-dashed border-white/5 text-center bg-white/[0.01]">
                    <Award className="w-10 h-10 text-gray-800 mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-bold text-gray-700 tracking-widest italic">No certificates yet</p>
                  </div>
                ) : (
                  realCertificates.map((cert: any) => (
                    <motion.div 
                      key={cert.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="glass-card-premium p-6 bg-gradient-to-br from-[#1a1300] to-black border-yellow-500/20 relative group"
                    >
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                           <Award className="w-6 h-6 text-yellow-500" />
                           <p className="text-[9px] font-bold text-yellow-500/50 italic">Verified expert</p>
                        </div>
                        <div>
                          <h4 className="font-black text-lg tracking-tight leading-none text-white">{cert.subject.title}</h4>
                          <p className="text-[9px] text-gray-600 font-medium mt-1 italic">Id: {cert.certifier_id}</p>
                        </div>
                        <a 
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-yellow-500 text-black rounded-xl text-[9px] font-black tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> Download node
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* AI Core Hub */}
            <div className="glass-card-premium p-8 bg-[#080808] border-purple-500/20 space-y-8 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-purple-600/20 transition-all duration-1000" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.3)]">
                   <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h3 className="text-xs font-black tracking-tight">AI Helper</h3>
                   <p className="text-[9px] text-purple-400 font-bold mt-1 italic">Ready to help</p>
                 </div>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed relative z-10">Explain difficult engineering topics instantly via the AI helper.</p>
              <button 
                onClick={() => (document.querySelector('button[class*="h-16"]') as any)?.click()}
                className="w-full py-4 bg-purple-600 text-white rounded-xl text-[9px] font-bold tracking-widest hover:bg-purple-500 transition-all flex items-center justify-center gap-2 relative z-10"
              >
                <Sparkles className="w-3.5 h-3.5" /> Start chat
              </button>
            </div>

            {/* Course Forge Engine */}
            <div className="glass-card-premium p-8 bg-[#080808] border-orange-500/20 space-y-6 group overflow-hidden relative">
               <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-[60px] -mr-20 -mb-20" />
               <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-[0_0_25px_rgba(234,88,12,0.3)] text-white">
                   <Play className="w-6 h-6 fill-current" />
                </div>
                <div>
                   <h3 className="text-xs font-black tracking-tight">Add courses</h3>
                   <p className="text-[9px] text-orange-400 font-bold mt-0.5 italic">Add from YouTube</p>
                 </div>
               </div>
               <div className="space-y-3 relative z-10">
                 <input 
                    id="playlist-id-input-v2"
                    type="text" 
                    placeholder="YouTube Playlist ID..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-5 text-[10px] font-bold text-white focus:outline-none focus:border-orange-500/40 focus:bg-white/10 transition-all placeholder:text-gray-800"
                 />
                 <button 
                  onClick={async () => {
                    const input = document.getElementById('playlist-id-input-v2') as HTMLInputElement;
                    if (!input.value) return;
                    try {
                      await apiClient.post('/subjects/import-youtube', { playlistId: input.value });
                      window.location.reload();
                    } catch (e) { alert("Import Failed."); }
                  }}
                  className="w-full py-4 bg-orange-600 text-white rounded-xl text-[9px] font-bold tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                 >
                   Add course
                 </button>
              </div>
            </div>

          </div>

        </div>
      </main>
      {mounted && isAuthenticated && <FloatingAiAssistant />}
    </div>
  );
}
