"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useImageStore } from "@/store";

// Complete list of all 34 anniversary photos with correct extensions
const photosList = [
  // 1-5: .JPG
  ...[1, 2, 3, 4, 5].map((i) => ({
    id: i,
    src: `/images/${i}.JPG`,
    alt: `Kỷ niệm ${i}`,
    desc: "Những ngày đầu tiên...",
  })),
  // 6-10: .jpeg
  ...Array.from({ length: 5 }, (_, i) => i + 6).map((i) => ({
    id: i,
    src: `/images/${i}.jpeg`,
    alt: `Kỷ niệm ${i}`,
    desc: "Từng chút một, mình hiểu nhau hơn.",
  })),
  // 11-15: .jpg
  ...Array.from({ length: 5 }, (_, i) => i + 11).map((i) => ({
    id: i,
    src: `/images/${i}.jpg`,
    alt: `Kỷ niệm ${i}`,
    desc: "Những khoảnh khắc bên nhau.",
  })),
  // 16-17: .jpeg
  ...[16, 17].map((i) => ({
    id: i,
    src: `/images/${i}.jpeg`,
    alt: `Kỷ niệm ${i}`,
    desc: "Kỷ niệm ngọt ngào.",
  })),
  // 18-20: .JPG
  ...[18, 19, 20].map((i) => ({
    id: i,
    src: `/images/${i}.JPG`,
    alt: `Kỷ niệm ${i}`,
    desc: "Hạnh phúc giản đơn.",
  })),
  // 21: .jpeg
  {
    id: 21,
    src: "/images/21.jpeg",
    alt: "Kỷ niệm 21",
    desc: "Một tình yêu đẹp đẽ.",
  },
  // 22-25: .JPG
  ...[22, 23, 24, 25].map((i) => ({
    id: i,
    src: `/images/${i}.JPG`,
    alt: `Kỷ niệm ${i}`,
    desc: "Cùng nhau lớn lên.",
  })),
  // 26-30: .jpg
  ...Array.from({ length: 5 }, (_, i) => i + 26).map((i) => ({
    id: i,
    src: `/images/${i}.jpg`,
    alt: `Kỷ niệm ${i}`,
    desc: "Yêu thương mỗi ngày.",
  })),
  // 31-34: .jpg
  ...Array.from({ length: 4 }, (_, i) => i + 31).map((i) => ({
    id: i,
    src: `/images/${i}.jpg`,
    alt: `Kỷ niệm ${i}`,
    desc: "9 năm bên nhau, mãi mãi yêu em.",
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
          34 mảnh ghép, 1 tình yêu trọn vẹn.
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
  desc: string;
}

function GalleryItem({ photo, index }: { photo: Photo; index: number }) {
  const setSelectedImage = useImageStore((state) => state.setSelectedImage);
  // Use a stable value based on index to avoid impure/hydration issues
  const randomRotate = useMemo(() => Math.sin(index + 1337) * 2, [index]);

  const handleClick = () => {
    setSelectedImage({
      src: photo.src,
      alt: photo.alt,
      description: photo.desc,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ scale: 1.05, rotate: randomRotate }}
      className="relative aspect-square overflow-hidden rounded-xl bg-rose-100/50 shadow-sm border border-rose-50 cursor-pointer group"
      onClick={handleClick}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <p className="text-white text-sm font-light">Xem chi tiết</p>
      </div>
    </motion.div>
  );
}
