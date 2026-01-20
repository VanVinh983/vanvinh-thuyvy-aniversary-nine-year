"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden z-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="space-y-6"
      >
        <span className="block text-rose-500 font-serif tracking-widest text-lg md:text-xl uppercase">
          Happy Anniversary
        </span>
        <h1 className="text-5xl md:text-8xl font-serif text-slate-200 tracking-tight leading-tight">
          9 Năm <span className="text-gradient-gold font-bold">Yêu Thương</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-lg md:text-xl font-light italic">
          &quot;Cảm ơn em vì đã ở bên anh suốt hành trình này.&quot;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 animate-bounce"
      >
        <ArrowDown className="text-rose-400 w-8 h-8" />
      </motion.div>
    </section>
  );
}
