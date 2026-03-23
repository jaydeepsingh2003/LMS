"use client";

import { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipForward,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export interface VideoPlayerProps {
  videoId: string;
  initialTime?: number;
  onProgress?: (time: number) => void;
  onComplete?: () => void;
  title?: string;
}

export default function PremiumVideoPlayer({ videoId, initialTime, onProgress, onComplete, title }: VideoPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleReady = (event: any) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    if (initialTime) {
      event.target.seekTo(initialTime, true);
    }
  };

  const handleStateChange = (event: any) => {
    // 1: Playing, 2: Paused
    setIsPlaying(event.data === 1);
  };

  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      const time = player.getCurrentTime();
      setCurrentTime(time);
      if (onProgress) onProgress(Math.floor(time));
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying, onProgress]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    player.seekTo(time, true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="relative aspect-video bg-black rounded-3xl overflow-hidden group shadow-2xl border border-white/5"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
          },
        }}
        className="w-full h-full pointer-events-none"
        onReady={handleReady}
        onStateChange={handleStateChange}
        onEnd={onComplete}
      />

      {/* Custom Overlay Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold tracking-tight text-lg drop-shadow-lg">
                {title || "Now Playing"}
              </h3>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Play Button (Large) */}
            <div className="flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,184,0,0.5)] transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-black fill-black" />
                ) : (
                  <Play className="w-8 h-8 text-black fill-black ml-1" />
                )}
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="relative group/bar h-1.5 w-full bg-white/20 rounded-full cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-accent rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)]"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity"
                  style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <button onClick={() => player.seekTo(currentTime - 10, true)} className="text-white/70 hover:text-white transition-colors">
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button onClick={togglePlay} className="text-white hover:text-accent transition-colors">
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>
                    <button onClick={() => player.seekTo(currentTime + 10, true)} className="text-white/70 hover:text-white transition-colors">
                      <RotateCw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-xs font-black tracking-widest text-white/80 tabular-nums">
                    {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 group/vol">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-white/70 hover:text-white transition-colors">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-300">
                      <input 
                        type="range" 
                        min="0" max="1" step="0.1" 
                        value={isMuted ? 0 : volume} 
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setVolume(v);
                          player.setVolume(v * 100);
                          setIsMuted(v === 0);
                        }}
                        className="w-full accent-accent"
                      />
                    </div>
                  </div>
                  <button className="text-white/70 hover:text-white transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
