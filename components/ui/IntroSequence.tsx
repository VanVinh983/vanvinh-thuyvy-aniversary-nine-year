"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IntroHeartCanvas } from "@/components/3d/IntroHeart";
import { LockScreen } from "./LockScreen";

export function IntroSequence({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<"LOCK" | "HEART" | "DONE">("LOCK");

  useEffect(() => {
    const unlocked = sessionStorage.getItem("anniversary_unlocked");
    if (unlocked === "true") {
      setStep("HEART");
    }
  }, []);

  const handleUnlockSuccess = () => {
    setTimeout(() => {
      setStep("HEART");
    }, 1000);
  };

  const handleHeartComplete = () => {
    setStep("DONE");

    // Trigger background music when intro transition is nearly finished
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("start-bg-music"));
      }, 800);
    }
  };

  return (
    <>
      {/* Intro Sequence Wrapper */}
      <AnimatePresence>
        {step !== "DONE" && (
          <motion.div
            key="intro-sequence-wrapper"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            {/* The actual sequence layers */}
            <AnimatePresence mode="wait">
              {step === "LOCK" && (
                <motion.div
                  key="lock-layer"
                  className="absolute inset-0 z-[110]"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <LockScreen onUnlock={handleUnlockSuccess} />
                </motion.div>
              )}

              {step === "HEART" && (
                <motion.div
                  key="heart-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 1.5,
                    filter: "blur(40px)",
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 z-[110] bg-black flex items-center justify-center pointer-events-none"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                      <IntroHeartCanvas onComplete={handleHeartComplete} />
                    </Canvas>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1, duration: 2 }}
                    className="absolute bottom-20 text-rose-200/50 font-serif italic text-sm tracking-widest"
                  >
                    Đang tìm về ký ức...
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Reveal when intro sequence is DONE */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: step === "DONE" ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
