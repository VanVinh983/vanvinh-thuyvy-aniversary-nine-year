"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const photos = Array.from({ length: 25 }, (_, i) => i + 1).map((i) => ({
  id: i,
  src: `/images/${i}.JPG`, // Assuming most are .JPG, we might need to handle .jpeg extension dynamically or just standardize.
  // For now, based on previous code, some were .jpeg. Let's try to be consistent or use a helper.
  // However, for the 3D gallery we actuaally used .JPG.
  // Let's stick to the user's previous pattern or just use .JPG and assume they rename or we fix it later.
  // Based on the file view earlier: 1-5 .JPG, 6-17 .jpeg, 18-20 .JPG, 21 .jpeg, 22-25 .JPG.
  // That's messy. Let's try to preserve the specific logic but clean the syntax.
  alt: `Kỷ niệm ${i}`,
}));

// Actually, rewriting the array manually to match the previous specific extensions to be safe
const photosList = [
  ...[1, 2, 3, 4, 5].map((i) => ({
    id: i,
    src: `/images/${i}.JPG`,
    alt: `Kỷ niệm ${i}`,
  })),
  ...Array.from({ length: 12 }, (_, i) => i + 6).map((i) => ({
    id: i,
    src: `/images/${i}.jpeg`,
    alt: `Kỷ niệm ${i}`,
  })),
  ...[18, 19, 20].map((i) => ({
    id: i,
    src: `/images/${i}.JPG`,
    alt: `Kỷ niệm ${i}`,
  })),
  { id: 21, src: "/images/21.jpeg", alt: "Kỷ niệm 21" },
  ...[22, 23, 24, 25].map((i) => ({
    id: i,
    src: `/images/${i}.JPG`,
    alt: `Kỷ niệm ${i}`,
  })),
];

export function Gallery() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto z-10 relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-200 mb-4">
          Khoảnh Khắc Của Chúng Mình
        </h2>
        <p className="text-slate-400 italic">
          25 mảnh ghép, 1 tình yêu trọn vẹn.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photosList.map((photo, index) => (
          <GalleryItem key={photo.id} photo={photo} index={index} />
        ))}
      </div>
    </section>
  );
}

interface Photo {
  id: number;
  src: string;
  alt: string;
}

function GalleryItem({ photo, index }: { photo: Photo; index: number }) {
  // Use a stable value based on index to avoid impure/hydration issues
  const randomRotate = useMemo(() => Math.sin(index + 1337) * 2, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ scale: 1.05, rotate: randomRotate }}
      className="relative aspect-square overflow-hidden rounded-xl bg-rose-100/50 shadow-sm border border-rose-50 cursor-pointer group"
    >
      <img src={photo.src} alt={photo.alt} />
    </motion.div>
  );
}
