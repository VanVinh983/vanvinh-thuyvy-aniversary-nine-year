"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, LockOpen, Unlock } from "lucide-react";
import { useEffect, useState } from "react";

const CORRECT_PASSWORD = "2017"; // 2026 - 9 years = 2017 start date (approx)

export function LockScreen({ onUnlock }: { onUnlock?: () => void }) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Function to unlock audio context on first interaction
  const handleInteraction = () => {
    if (!interacted && typeof window !== "undefined") {
      const audio = new Audio("/sounds/heart-beat.mp3");
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          audio.pause();
          setInteracted(true);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    // Check session storage on mount
    const unlocked = sessionStorage.getItem("anniversary_unlocked");
    if (unlocked === "true") {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (password.length === 4) {
      if (password === CORRECT_PASSWORD) {
        setIsUnlocking(true);
        sessionStorage.setItem("anniversary_unlocked", "true");

        // Prime audio context on user gesture
        const audio = new Audio("/sounds/heart-beat.mp3");
        audio.volume = 0;
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});

        // Allow animation to play before removing component
        setTimeout(() => {
          setIsLocked(false);
          if (onUnlock) onUnlock();
        }, 1500);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setPassword(""); // Clear invalid password for retry
        }, 500);
      }
    }
  }, [password]);

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-rose-100"
          onClick={handleInteraction}
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-900/20 blur-[100px] rounded-full animate-pulse" />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center gap-8 p-4"
          >
            {/* Lock Icon */}
            <div className="relative">
              <motion.div
                animate={
                  isUnlocking ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }
                }
                transition={{ duration: 0.5 }}
              >
                <Lock
                  size={48}
                  className={`text-rose-400 ${error ? "animate-shake" : "animate-pulse"}`}
                  strokeWidth={1.5}
                />
              </motion.div>

              {isUnlocking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center text-rose-300"
                >
                  <Unlock size={56} strokeWidth={2} />
                </motion.div>
              )}
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-serif tracking-widest text-rose-200/80">
                BÍ MẬT CỦA CHÚNG TA
              </h1>
              <p className="text-sm text-rose-200/40 font-light italic">
                Nhập năm bắt đầu tình yêu (Gợi ý: 2017)
              </p>
            </div>

            {/* Input */}
            {/* Input - Auto unlocks on match */}
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="relative group mt-8"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu của kỷ niệm..."
                className="w-64 bg-transparent border-b border-rose-200/20 px-6 py-3 text-center text-rose-100 placeholder:text-rose-200/20 focus:outline-none focus:border-rose-400/50 transition-all tracking-[0.5em] font-light text-xl placeholder:tracking-normal font-serif"
                autoFocus
                maxLength={4}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
