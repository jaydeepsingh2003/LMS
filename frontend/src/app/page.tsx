"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ArrowRight, 
  Search, 
  Layout, 
  Clock, 
  Trophy,
  Star,
  Flame,
  Bot,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Play,
  Github,
  Twitter,
  Linkedin,
  Award
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import SharedNavbar from "@/components/UI/SharedNavbar";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/UI/Skeleton";
import { cn } from "@/lib/utils";
import FloatingAiAssistant from "@/components/Ai/FloatingAiAssistant";

export default function HomePage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [discoveryVideos, setDiscoveryVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        // Individual resolution for maximum resilience
        const loadSubjects = async () => {
          try {
            const res = await apiClient.get("/subjects");
            setSubjects(res.data || []);
          } catch (e) {
            console.warn("⚠️ [SUBJECT_MESH_DISCONNECTED]: Using local cache fallback.");
            setSubjects([]);
          }
        };

        const loadDiscovery = async () => {
          try {
            const res = await apiClient.get("/videos/discover");
            setDiscoveryVideos(res.data || []);
          } catch (e) {
            console.warn("⚠️ [DISCOVERY_NODE_FAILED]: Initializing virtual registry.");
            setDiscoveryVideos([]);
          }
        };

        await Promise.all([loadSubjects(), loadDiscovery()]);
      } catch (e) {
        console.error("Critical System Failure during Knowledge Sync", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredSubjects = subjects.filter((s: any) => s.isFeatured).slice(0, 3);
  const categories = ["All", ...Array.from(new Set(subjects.map((s: any) => s.category || "Engineering")))];
  
  const filteredSubjects = subjects.filter((s: any) => {
    const titleMatch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = activeCategory === "All" || s.category === activeCategory;
    return titleMatch && catMatch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-accent/30 selection:text-white overflow-x-hidden">
      <SharedNavbar />
      
      {/* Cinematic Masterpiece Hero v6 - Perfect Alignment */}
      <div className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-32 overflow-hidden">
        {/* Advanced Ambient Layer */}
        <div className="mesh-background opacity-40 fixed inset-0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[150vh] bg-[radial-gradient(circle_at_50%_0%,rgba(255,184,0,0.15),transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-12 space-y-10 text-center flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full glass-card border-accent/20 text-accent font-bold tracking-widest text-[10px] shadow-[0_0_40px_rgba(255,184,0,0.15)]">
                   <Flame className="w-5 h-5 animate-pulse" /> Start your career
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[1.05] text-white">
                  Build your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent via-orange-400 to-red-600">Great future.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl leading-relaxed italic mx-auto">
                  Join our simple and powerful learning platform to build your engineering skills.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <Link href="/auth/register" className="premium-button py-6 px-14 group h-18 text-[11px] font-bold tracking-widest overflow-hidden whitespace-nowrap shadow-[0_20px_50px_-10px_rgba(255,184,0,0.25)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                  <span className="relative z-10 flex items-center gap-5">
                    Join now <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-700" />
                  </span>
                </Link>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-xl border-2 border-black bg-white/5 overflow-hidden glass-card p-1 shadow-2xl">
                       <div className="w-full h-full bg-accent/20 rounded-lg flex items-center justify-center text-accent text-[10px] font-black italic">KN</div>
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-xl border-2 border-black bg-accent flex items-center justify-center text-black text-[10px] font-black shadow-[0_0_40px_rgba(255,184,0,0.4)] z-10 shrink-0">
                    +18K
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative aspect-square max-w-xl mx-auto hidden lg:block"
            >
              {/* Central Premium Card Cluster */}
              <div className="w-full h-full glass-card-premium border-white/10 rounded-[5rem] p-12 relative z-10 overflow-hidden group shadow-[0_100px_250px_-50px_rgba(255,184,0,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-purple-600/10 group-hover:scale-150 transition-transform duration-[5s]" />
                <div className="relative z-20 space-y-12">
                   <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-[1.8rem] bg-accent flex items-center justify-center shadow-glow-lg group-hover:rotate-[360deg] transition-transform duration-[2s]">
                        <BookOpen className="w-10 h-10 text-black" />
                      </div>
                      <div className="px-5 py-2 rounded-xl glass-card border-white/10 uppercase text-[9px] font-black tracking-widest text-gray-500">
                        Registry Active
                      </div>
                   </div>
                   <div className="space-y-6">
                      <p className="text-[11px] font-black text-accent uppercase tracking-[0.5em] mb-4">Elite Node Cluster 01</p>
                      <h3 className="text-4xl font-black tracking-tight leading-[0.95] text-white">Advanced Industrial <br /><span className="text-accent underline decoration-white/10 underline-offset-[10px]">Architecture.</span></h3>
                   </div>
                   <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-10">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Stability Index</p>
                        <p className="text-2xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">99.98%</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Knowledge Load</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter">Ultra High</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Decorative Floating Accents */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 w-44 h-44 glass-card rounded-[2.5rem] flex items-center justify-center shadow-2xl border-white/5 hover:border-accent/40 transition-colors z-20 group"
              >
                <Trophy className="w-20 h-20 text-accent drop-shadow-glow group-hover:scale-110 transition-transform duration-700" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-16 -left-16 w-36 h-36 glass-card rounded-[2.2rem] flex items-center justify-center shadow-2xl border-white/5 z-20"
              >
                <Star className="w-14 h-14 text-blue-400 animate-pulse drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Industrial Growth Indicators - Balanced Grid */}
      <section className="py-20 relative overflow-hidden bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { label: "Active students", val: "18.4K", icon: TrendingUp },
              { label: "Online courses", val: "240+", icon: BookOpen },
              { label: "Completion rate", val: "94.2%", icon: ShieldCheck },
              { label: "Expert status", val: "Verified", icon: Award }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="space-y-3 text-center glass-card-premium py-10 px-6 border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mx-auto group-hover:bg-accent/10 transition-colors">
                  <s.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black tracking-tight text-white tabular-nums">{s.val}</p>
                  <p className="text-[9px] font-bold tracking-widest text-accent/60 italic">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Cluster - Perfect Spacing */}
      <section className="py-32 relative bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-20">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-4 text-accent text-[9px] font-bold uppercase tracking-[0.4em] border-l-4 border-accent pl-6">
                    <Sparkles className="w-4 h-4" /> All our courses
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">Popular learning <br /><span className="text-accent italic selection:text-white underline decoration-white/10 underline-offset-[10px]">Paths.</span></h2>
              </div>
              <p className="text-gray-500 font-medium text-base max-w-sm mb-4 italic leading-relaxed border-l border-white/10 pl-8">
                We offer the best engineering courses based on real-world industry needs to help you grow.
              </p>
           </div>
          
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
            {!loading && (featuredSubjects.length > 0 ? featuredSubjects : discoveryVideos.slice(0, 3)).map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card-premium group relative min-h-[440px] flex flex-col justify-end p-10 overflow-hidden border-white/5 hover:border-accent/50 transition-all duration-700 hover:shadow-[0_60px_150px_-50px_rgba(255,184,0,0.2)]"
              >
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
                  <img 
                    src={item.thumbnail || `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200`}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-105 transition-all duration-[2s]"
                  />
                </div>

                <div className="relative z-20 space-y-8">
                   <div className="flex justify-between items-center">
                     <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform">
                        <BookOpen className="w-6 h-6 text-black" />
                     </div>
                     <div className="px-3 py-1 rounded-full glass-card border-white/10 text-[8px] font-bold text-accent/80">
                        Tier 1
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                      <p className="text-[9px] font-bold tracking-widest text-accent italic">Featured masterclass</p>
                      <h4 className="text-xl font-black tracking-tight group-hover:text-accent transition-colors duration-500 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed italic">
                        {item.description || "Mastering industrial engineering through elite curriculum architecture."}
                      </p>
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 tracking-wide">
                         <Clock className="w-4 h-4 text-accent/60" /> Expert path
                      </div>
                      <Link 
                        href={`/subjects/${item.id}`}
                        className="premium-button py-3 px-8 text-[10px] font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-500"
                      >
                        Enroll
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explorer Registry - Perfectly Aligned Forms */}
      <section id="subjects" className="py-32 relative bg-black/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mb-20">
              <div className="space-y-4 flex-1">
                 <div className="inline-flex items-center gap-3 text-accent text-[9px] font-bold tracking-[0.4em] border-l-4 border-accent pl-6">
                    <TrendingUp className="w-4 h-4" /> Global course list
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">Find courses</h2>
                 <p className="text-gray-500 font-medium text-base max-w-xl italic">Search our library of over 180 engineering courses.</p>
              </div>
              
              <div className="w-full md:w-[350px] relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-accent transition-all duration-300" />
                <input 
                  type="text" 
                  placeholder="Search for topics..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[11px] font-bold text-white focus:outline-none focus:border-accent/40 focus:bg-white/10 transition-all duration-700 placeholder:text-gray-700 shadow-2xl"
                />
              </div>
           </div>

           <div className="flex flex-wrap gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[9px] font-bold tracking-widest border transition-all duration-500 whitespace-nowrap",
                    activeCategory === cat ? "bg-accent text-black border-accent shadow-glow" : "bg-white/5 text-gray-500 border-white/5 hover:border-white/20"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>

           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="glass-card h-[380px] animate-pulse bg-white/5 rounded-[2rem]" />
                ))}
             </div>
           ) : filteredSubjects.length === 0 ? (
             <div className="text-center py-32 glass-card rounded-[2rem] border-dashed border-white/10 bg-white/[0.01]">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                  <Search className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-gray-600 tracking-tight">No courses found</h3>
               <p className="text-[10px] text-gray-700 mt-2 font-bold tracking-widest italic">Try re-calibrating your query parameters.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredSubjects.map((subject, idx) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card-premium group flex flex-col p-8 relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:border-accent/30"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                    
                    <div className="relative z-10 flex-1 space-y-6">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/30 transition-all duration-500">
                          <BookOpen className="w-6 h-6 text-accent" />
                       </div>
                       
                       <div className="space-y-2">
                          <h4 className="text-lg font-black tracking-tight group-hover:text-accent transition-colors leading-tight">{subject.title}</h4>
                          <p className="text-gray-500 text-xs font-medium line-clamp-3 leading-relaxed italic">
                            {subject.description || "Master the core principles of engineering and production-grade development in this high-fidelity module."}
                          </p>
                       </div>

                       <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-[10px] font-bold tracking-wide text-gray-500">
                          <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-accent/60" /> {subject._count?.sections || 0} nodes</span>
                          <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-accent/60" /> Expert tier</span>
                       </div>
                    </div>

                    <Link 
                      href={`/subjects/${subject.id}`} 
                      className="mt-8 py-4 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold tracking-tight flex items-center justify-center gap-3 hover:bg-accent hover:text-black hover:border-accent transition-all duration-500"
                    >
                      Initialize module <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                ))}
             </div>
           )}

           <div className="mt-32 text-center">
              <div className="inline-block glass-card-premium p-10 border-white/10 bg-[#080808] relative group overflow-hidden rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1500" />
                 <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-black tracking-tight leading-none text-white">Full access registry</h3>
                    <p className="text-gray-500 font-medium text-base max-w-sm mx-auto italic">Join the next generation of industrial leaders mastering the world's knowledge mesh.</p>
                    <Link href="/auth/register" className="premium-button py-5 px-12 inline-flex items-center gap-4 text-[10px] font-bold tracking-widest shadow-glow-lg">
                       Global sync start <TrendingUp className="w-5 h-5" />
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Industrial Footer - Perfect Balance */}
      <footer className="py-24 relative bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
              <div className="md:col-span-2 space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-glow">
                       <Layout className="w-7 h-7 text-black" />
                    </div>
                    <span className="text-3xl font-black tracking-[-0.08em] text-white">KODNEST</span>
                 </div>
                 <p className="text-gray-500 text-base font-medium max-w-sm italic leading-relaxed">
                   The world's most powerful industrial learning operating system. Architected for 2026 excellence.
                 </p>
                 <div className="flex gap-6">
                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-accent hover:border-accent/40 transition-all">
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Registry Hub</p>
                 <ul className="space-y-5">
                    {["Elite Masters", "Knowledge Mesh", "Industrial Path", "Maturity Index"].map(l => (
                      <li key={l}><a href="#" className="text-gray-500 font-bold hover:text-accent transition-colors text-xs uppercase tracking-widest">{l}</a></li>
                    ))}
                 </ul>
              </div>

              <div className="space-y-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Legal Node</p>
                 <ul className="space-y-5">
                    {["Security Mesh", "Stability Auth", "Global Terms", "Auth Privacy"].map(l => (
                      <li key={l}><a href="#" className="text-gray-500 font-bold hover:text-accent transition-colors text-xs uppercase tracking-widest">{l}</a></li>
                    ))}
                 </ul>
              </div>
           </div>
           
           <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <p className="text-gray-600 text-[13px] font-medium italic">© 2026 KodNest Learning Systems. </p>
              <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/[0.01] text-accent text-[8px] font-black uppercase tracking-[0.3em]">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Systems online
              </div>
           </div>
        </div>
      </footer>

      {mounted && isAuthenticated && <FloatingAiAssistant />}
    </div>
  );
}
