"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import SubjectSidebar from "@/components/Sidebar/SubjectSidebar";
import { useSubjectStore } from "@/store/subjectStore";

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  const { subjectId } = useParams() as any;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useAuthStore();
  const { 
    currentSubject: subject, 
    userProgress, 
    isEnrolled,
    setSubject,
    setUserProgress,
    setIsEnrolled
  } = useSubjectStore();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await apiClient.get(`/subjects/${subjectId}/tree`);
        
        // Handle real-time initialization redirect
        if (response.data.redirect) {
          window.location.href = response.data.redirect;
          return;
        }

        setSubject(response.data);
        setUserProgress(response.data.userProgress || []);
        setIsEnrolled(response.data.isEnrolled);
      } catch (error) {

        console.error("Failed to fetch subject tree", error);
      }
    };
    if (subjectId) fetchTree();
  }, [subjectId, user, setSubject, setUserProgress, setIsEnrolled]);

  const handleEnroll = async () => {
    try {
      await apiClient.post(`/subjects/${subjectId}/enroll`);
      setIsEnrolled(true);
    } catch (e) {
      console.error("Enrollment failed", e);
    }
  };

  if (!subject) return <div className="min-h-screen bg-black flex items-center justify-center text-accent font-bold animate-pulse">Initializing Curriculum...</div>;

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in text-white">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl font-black tracking-tighter mb-4">{subject.title}</h1>
          <p className="text-xl text-gray-400">{subject.description || "Master this subject with our premium high-quality curriculum."}</p>
          <div className="flex items-center justify-center gap-8 py-8 border-y border-white/5">
            <div className="text-center">
              <p className="text-3xl font-black text-white">12</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Modules</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">8.5h</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Content</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">4.9</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Rating</p>
            </div>
          </div>
          <button 
            onClick={handleEnroll}
            className="premium-button text-lg px-12 py-4"
          >
            Enroll in Subject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <SubjectSidebar
        subject={subject}
        subjectId={subjectId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-6 left-6 z-40 bg-card border border-white/5 p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
