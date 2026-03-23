"use client";

import { motion } from "framer-motion";
import { Clock, BookOpen, Award, Flame } from "lucide-react";

interface StatProps {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}

const COLORS: Record<string, string> = {
  blue: "from-blue-500/20 to-indigo-500/5 border-blue-500/20 text-blue-400 shadow-blue-500/10",
  purple: "from-purple-500/20 to-fuchsia-500/5 border-purple-500/20 text-purple-400 shadow-purple-500/10",
  yellow: "from-yellow-500/20 to-amber-500/5 border-yellow-500/20 text-yellow-400 shadow-yellow-500/10",
  orange: "from-orange-500/20 to-red-500/5 border-orange-500/20 text-orange-400 shadow-orange-500/10",
};

const StatCard = ({ label, value, icon: Icon, colorKey }: { label: string; value: any; icon: any; colorKey: string }) => {
  const colorStyles = COLORS[colorKey];
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative group p-8 rounded-[2rem] bg-gradient-to-br ${colorStyles} border backdrop-blur-3xl overflow-hidden transition-all duration-700`}
    >
      {/* 3D Glass Effect Inner Layer */}
      <div className="absolute inset-0 bg-white/[0.01] border-t border-white/5 rounded-[2rem] pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 border border-white/5 shadow-inner-premium group-hover:border-white/20 transition-all duration-500">
            <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold text-gray-600">
            Real-time
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-bold tracking-widest text-gray-600 leading-none">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black tracking-tight text-white tabular-nums leading-none">
              {value}
            </h4>
            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Gloss Shimmer */}
      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-[1200ms] pointer-events-none" />
    </motion.div>
  );
};

export default function DashboardStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
      <StatCard label="My courses" value={stats.coursesJoined} icon={BookOpen} colorKey="blue" />
      <StatCard label="Learning time" value={stats.hoursLearned} icon={Clock} colorKey="purple" />
      <StatCard label="Certificates" value={stats.certificates} icon={Award} colorKey="yellow" />
      <StatCard label="Daily streak" value={stats.streak} icon={Flame} colorKey="orange" />
    </div>
  );
}
