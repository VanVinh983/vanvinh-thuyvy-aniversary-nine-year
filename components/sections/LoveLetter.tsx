"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function LoveLetter() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center z-10 px-4">
      {/* Background overlay for readability over 3D scene */}
      {/* We use a gradient that fades from transparent to a solid soft warm color at the bottom */}
      {/* Background overlay for readability over 3D scene */}
      {/* Dark gradient for dark theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto space-y-10"
      >
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-2xl md:text-4xl font-serif text-slate-300 leading-relaxed drop-shadow-sm"
          >
            9 năm không phải là điểm đến,
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-2xl md:text-4xl font-serif text-slate-300 leading-relaxed drop-shadow-sm"
          >
            mà là minh chứng cho việc
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="text-2xl md:text-4xl font-serif text-slate-100 font-bold leading-relaxed drop-shadow-md"
          >
            chúng ta chưa bao giờ buông tay nhau.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
