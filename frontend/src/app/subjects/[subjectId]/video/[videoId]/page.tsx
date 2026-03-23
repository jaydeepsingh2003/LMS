"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, Info, ThumbsUp, Share2, Award, CheckCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import PremiumVideoPlayer from "@/components/Video/PremiumVideoPlayer";
import ChatMessage from "@/components/Ai/ChatMessage";
import { cn } from "@/lib/utils";

import { useSubjectStore } from "@/store/subjectStore";
import { extractVideoId } from "@/lib/youtube";


export default function VideoPage() {
  const { videoId } = useParams() as any;
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const { currentSubject: subject, userProgress, setUserProgress } = useSubjectStore();

  const [currentTime, setCurrentTime] = useState(0);

  const totalVideos = subject?.sections?.reduce((acc: number, s: any) => acc + s.videos?.length, 0) || 1;
  const completedVideos = userProgress?.filter((p: any) => p.is_completed).length || 0;
  const progressPercent = (completedVideos / totalVideos) * 100;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await apiClient.get(`/videos/${videoId}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Failed to fetch video", error);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchVideo();
  }, [videoId]);

  const handleProgress = async (time: number) => {
    if (time % 10 === 0 && time !== currentTime) {
      setCurrentTime(time);
      try {
        await apiClient.post(`/videos/${videoId}/progress`, {
          lastPosition: time,
          isCompleted: false
        });
      } catch (e) {
        console.error("Failed to sync progress", e);
      }
    }
  };

  const handleComplete = async () => {
    try {
      await apiClient.post(`/videos/${videoId}/progress`, {
        lastPosition: video.duration_seconds || 0,
        isCompleted: true
      });
      // OPTIMISTIC UPDATE: Update store so sidebar matches instantly
      const updated = userProgress?.map((p: any) => p.video_id === videoId ? { ...p, is_completed: true } : p);
      if (updated && !updated.find(p => p.video_id === videoId)) {
        updated.push({ video_id: videoId, is_completed: true, last_position_seconds: video.duration_seconds });
      }
      if (updated) setUserProgress(updated);
    } catch (e) {
      console.error("Failed to mark video as completed", e);
    }
  };

  const [aiQuestion, setAiQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userMsg = aiQuestion.trim();
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setAiQuestion("");
    setAiLoading(true);

    try {
      const response = await apiClient.post("/ai/ask", {
        question: userMsg,
        context: `The user is watching a video titled "${video.title}" with description: ${video.description || 'No description'}`
      });
      setChatHistory(prev => [...prev, { role: "ai", content: response.data.answer }]);
    } catch (err) {
      console.error("AI Error:", err);
      setChatHistory(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-gray-500 animate-pulse">Loading amazing content...</div>;
  if (!video) return <div className="p-12 text-red-500">Video not found.</div>;

  const youtubeVideoId = extractVideoId(video.youtube_url);


  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 md:p-8 gap-8 animate-in">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {/* Video Player Section with Ambient Glow */}
        <div className="relative group">
          <div className="video-ambient-glow" />
          <div className="relative z-10 glass-card p-2 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5 overflow-hidden">
            <PremiumVideoPlayer
              videoId={youtubeVideoId}
              initialTime={video.userProgress?.[0]?.last_position_seconds || 0}
              onProgress={handleProgress}
              onComplete={handleComplete}
              title={video.title}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight mb-2">{video.title}</h1>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium italic">
                  <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5 text-accent" /> 1.2k Likes</span>
                  <span className="opacity-20">•</span>
                  <span>Published 48h ago</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-lg border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group/btn"><ThumbsUp className="w-4 h-4 text-gray-500 group-hover/btn:text-accent" /></button>
                <button className="p-2.5 rounded-lg border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group/btn"><Share2 className="w-4 h-4 text-gray-500 group-hover/btn:text-accent" /></button>
              </div>
            </div>

            <div className="glass-card p-6 border-white/5">
              <h3 className="text-[10px] font-bold tracking-widest text-accent mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Instructor notes
              </h3>
              <p className="text-gray-400 leading-relaxed text-xs italic font-medium">
                {video.description || "In this lesson, we cover the core concepts of this module. Pay attention to the practical examples shown in the second half of the video."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="w-full lg:w-96 space-y-4">
        {/* Progress Card */}
        <div className={cn(
          "p-5 border rounded-2xl space-y-4 transition-all duration-500",
          progressPercent === 100 
            ? "border-green-500/30 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]" 
            : "border-yellow-500/20 bg-yellow-500/5"
        )}>
          <h3 className={cn(
            "text-[10px] font-bold tracking-widest flex items-center gap-2",
            progressPercent === 100 ? "text-green-500" : "text-yellow-500"
          )}>
            <Award className="w-3.5 h-3.5" /> 
            {progressPercent === 100 ? "Course finished" : "Certificate progress"}
          </h3>
          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className={cn(
                "h-full transition-all duration-1000",
                progressPercent === 100 ? "bg-green-500" : "bg-yellow-500"
              )}
            />
          </div>
          <div className="flex justify-between items-end">
             <p className="text-[9px] text-gray-600 font-bold tracking-widest italic leading-none">
              {completedVideos} / {totalVideos} lessons finished
            </p>
            {progressPercent === 100 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 text-green-500 text-[9px] font-black tracking-widest italic">
                <CheckCircle className="w-3 h-3" /> FINISHED
              </motion.div>
            )}
          </div>

          {progressPercent === 100 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <Link 
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-black rounded-xl text-[9px] font-bold tracking-widest hover:bg-green-400 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
              >
                <Award className="w-3.5 h-3.5" /> Get your certificate
              </Link>
            </motion.div>
          )}
        </div>

        {/* AI Tutor Card */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowAiTutor(!showAiTutor)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-2xl text-left relative overflow-hidden group transition-all active:scale-95 shadow-glow-purple"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-black tracking-tight text-white italic">Ask AI Helper</p>
                <p className="text-[10px] text-white/70 font-medium">Powered by Llama 3.3</p>
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showAiTutor && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase">AI Assistant</span>
                </div>
                <div className="p-4 flex flex-col min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-hide">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                      <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                      <p className="text-xs font-medium px-6">Ask me anything about &quot;{video.title}&quot; or request a summary.</p>
                    </div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <ChatMessage key={i} role={msg.role} content={msg.content} />
                    ))
                  )}
                  {aiLoading && (
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl w-fit animate-pulse">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
                <form onSubmit={handleAskAi} className="p-4 bg-white/5 border-t border-white/5">
                  <input 
                    type="text" 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask about this lesson..." 
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    disabled={aiLoading}
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
