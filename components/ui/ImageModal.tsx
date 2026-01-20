"use client";

import { useImageStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function ImageModal() {
  const { selectedImage, setSelectedImage } = useImageStore();

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative max-w-4xl w-full bg-black/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto h-[50vh] md:h-[70vh]">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center bg-black/20">
                <h3 className="text-2xl font-serif font-bold text-slate-200 mb-4">
                  {selectedImage.alt}
                </h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  {selectedImage.description ||
                    "Một khoảnh khắc tuyệt vời được lưu giữ mãi mãi."}
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-rose-400 font-medium">
                  <span>✨ 9 Years Together</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
