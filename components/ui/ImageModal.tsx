"use client";

import { useImageStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function ImageModal() {
  const { selectedImage, setSelectedImage } = useImageStore();

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={handleClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:rotate-90 group"
            aria-label="Close"
          >
            <X
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </motion.button>

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 backdrop-blur-sm">
              {/* Gradient glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-amber-500/20 pointer-events-none" />

              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />

              {/* Description Overlay */}
              {selectedImage.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 md:p-8 pt-16"
                >
                  <p className="text-white text-lg md:text-2xl font-light text-center tracking-wide font-serif">
                    {selectedImage.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Hint Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-white/50 text-sm font-light"
            >
              Nhấn bất kỳ đâu để đóng
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
