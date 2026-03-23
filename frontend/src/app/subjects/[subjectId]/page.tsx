import { useSubjectStore } from "@/store/subjectStore";
import { cn } from "@/lib/utils";

import { Play, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner"; // Assuming sonner is available or will be added


export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const { currentSubject: subject, userProgress, setSubject } = useSubjectStore();
  const [syncing, setSyncing] = useState(false);

  if (!subject) return null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      // We need a playlist ID or just trigger the back-end to find it
      // For now, we assume the backend knows how to sync this subject
      // If we don't have a playlistId, we might need to prompt or use a saved one
      const response = await apiClient.post('/subjects/import-youtube', { 
        playlistId: subject.slug.startsWith('disc-') ? subject.slug.replace('disc-', '') : subject.title 
      });
      setSubject(response.data);
      alert("Course synchronized successfully!");
    } catch (e) {
      console.error("Sync failed", e);
      alert("Synchronization failed. Please check your connection.");
    } finally {
      setSyncing(false);
    }
  };


  // Find first video
  const firstVideo = subject.sections?.[0]?.videos?.[0];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 animate-in text-white pt-20">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{subject.title}</h1>
        <p className="text-base text-gray-500 max-w-2xl italic leading-relaxed">{subject.description || "In this course, you will learn everything you need to master this specialized domain."}</p>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold tracking-widest text-accent flex items-center gap-2">
            Course lessons
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className={cn(
                "p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-gray-500 hover:text-accent",
                syncing && "animate-spin text-accent"
              )}
              title="Sync with YouTube"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {firstVideo && (
              <Link 
                href={`/subjects/${subject.id}/video/${firstVideo.id}`}
                className="px-6 py-2.5 bg-accent text-black font-bold tracking-widest text-[10px] rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-glow"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start course
              </Link>
            )}
          </div>

        </div>

        {subject.sections?.map((section: any, sIdx: number) => (
          <motion.div 
            key={section.id || `page-section-${sIdx}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sIdx * 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-base font-black tracking-tight mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-accent border border-white/5 font-bold">{sIdx + 1}</span>
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.videos?.map((video: any, vIdx: number) => {
                const isCompleted = userProgress?.some((p: any) => p.video_id === video.id && p.is_completed);
                return (
                  <Link 
                    key={video.id || `page-video-${vIdx}`}
                    href={`/subjects/${subject.id}/video/${video.id}`}
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.07] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-gray-600 group-hover:text-accent transition-colors" />
                      )}
                      <div>
                        <p className="text-xs font-bold group-hover:text-accent transition-colors">{video.title}</p>
                        <p className="text-[9px] text-gray-700 font-bold tracking-widest italic">Ready to watch</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="text-[9px] font-bold tracking-widest text-green-500/40 italic">Completed</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
