"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, PlayCircle, CheckCircle, Lock, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubjectSidebarProps {
  subject: any;
  subjectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubjectSidebar({ subject, subjectId, isOpen, onClose }: SubjectSidebarProps) {
  const pathname = usePathname();

  const totalVideos = subject.sections.reduce((acc: number, s: any) => acc + s.videos.length, 0);
  const completedVideos = subject.userProgress?.filter((p: any) => p.is_completed).length || 0;
  const progressPercent = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  return (
    <aside className={cn(
      "bg-card border-r border-white/5 transition-all duration-300 z-50 flex flex-col h-full",
      isOpen ? "w-80" : "w-0 md:w-0 overflow-hidden"
    )}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Courses</span>
        </Link>
        <button onClick={onClose} className="md:hidden"><X className="w-5 h-5 text-white"/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-2 px-2 text-white">{subject.title}</h1>
          <div className="h-1.5 w-full bg-white/5 rounded-full mb-6 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)] transition-all duration-1000" 
            />
          </div>
        </div>

        <div className="space-y-4">
          {subject.sections.map((section: any, idx: number) => (
            <div key={section.id || `section-${idx}`} className="space-y-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.videos.map((video: any, vIdx: number) => {
                  const isActive = pathname.includes(video.id);
                  const vProgress = subject.userProgress?.find((p: any) => p.video_id === video.id);
                  const isCompleted = vProgress?.is_completed;
                  const isLocked = false; 

                  return (
                    <Link 
                      key={video.id || `video-${vIdx}`} 
                      href={`/subjects/${subjectId}/video/${video.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/5 text-sm group text-gray-400",
                        isActive && "bg-white/10 text-accent font-semibold border-l-4 border-accent rounded-l-none"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-gray-600" />
                      ) : (
                        <PlayCircle className={cn("w-4 h-4", isActive ? "text-accent" : "text-gray-400 group-hover:text-white")} />
                      )}
                      <span className="truncate">{video.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
