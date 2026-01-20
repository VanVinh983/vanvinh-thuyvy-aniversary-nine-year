"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "Năm 1",
    title: "Ngày đầu tiên",
    description: "Khoảnh khắc ta chọn nhau giữa muôn vạn người.",
  },
  {
    year: "Năm 2",
    title: "Hẹn hò",
    description: "Những buổi chiều tay trong tay, những nụ hôn vụng dại.",
  },
  {
    year: "Năm 3",
    title: "Thấu hiểu",
    description: "Học cách yêu cả những điều chưa hoàn hảo của nhau.",
  },
  {
    year: "Năm 4",
    title: "Khoảng cách",
    description: "Dẫu có xa xôi, trái tim vẫn luôn hướng về một phương.",
  },
  {
    year: "Năm 5",
    title: "Giông bão",
    description:
      "Cùng nhau đi qua khó khăn để biết mình cần nhau đến nhường nào.",
  },
  {
    year: "Năm 6",
    title: "Đồng hành",
    description: "Không chỉ là người yêu, mà là tri kỷ sẻ chia mọi buồn vui.",
  },
  {
    year: "Năm 7",
    title: "Vững tin",
    description:
      "Niềm tin đã trở thành một phần không thể thiếu trong hơi thở.",
  },
  {
    year: "Năm 8",
    title: "Xây dựng",
    description: "Cùng vun đắp những ước mơ chung cho tương lai.",
  },
  {
    year: "Năm 9",
    title: "Mãi mãi",
    description: "Vẫn chọn em, hôm nay, ngày mai và mãi về sau.",
  },
];

export function Timeline() {
  return (
    <section className="relative py-20 px-4 max-w-4xl mx-auto z-10">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-rose-200/50" />

      <div className="space-y-24">
        {milestones.map((milestone, index) => (
          <TimelineItem key={index} item={milestone} index={index} />
        ))}
      </div>
    </section>
  );
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

function TimelineItem({ item, index }: { item: Milestone; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex items-center justify-between w-full ${isEven ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className="w-5/12 text-right">
        {isEven ? (
          <div className="p-6 bg-black/40 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-500/30 hover:shadow-md transition-shadow">
            <span className="text-rose-400 font-bold block mb-2">
              {item.year}
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-200 mb-2">
              {item.title}
            </h3>
            <p className="text-slate-400 font-light text-sm">
              {item.description}
            </p>
          </div>
        ) : (
          <div />
        )}
      </div>

      <div className="w-2/12 flex justify-center relative">
        <div className="w-4 h-4 bg-rose-400 rounded-full ring-4 ring-rose-900/50 z-10" />
      </div>

      <div className="w-5/12 text-left">
        {!isEven ? (
          <div className="p-6 bg-black/40 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-500/30 hover:shadow-md transition-shadow">
            <span className="text-rose-400 font-bold block mb-2">
              {item.year}
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-200 mb-2">
              {item.title}
            </h3>
            <p className="text-slate-400 font-light text-sm">
              {item.description}
            </p>
          </div>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
