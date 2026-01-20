"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/bg-sound.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    const handleAutoPlay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) =>
            console.warn("Music auto-play blocked or failed:", err),
          );
      }
    };

    window.addEventListener("start-bg-music", handleAutoPlay);

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      window.removeEventListener("start-bg-music", handleAutoPlay);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={togglePlay}
        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-rose-300 hover:text-rose-100 hover:bg-white/20 transition-all border border-rose-200/20"
      >
        {isPlaying ? (
          <Volume2 size={20} className="animate-pulse" />
        ) : (
          <VolumeX size={20} />
        )}
      </button>
    </div>
  );
}
