import MainScene from "@/components/3d/MainScene";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { LoveLetter } from "@/components/sections/LoveLetter";
import { Timeline } from "@/components/sections/Timeline";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-transparent selection:bg-rose-200">
      {/* 3D Background - Fixed position */}
      <MainScene />

      {/* Scrollable Content */}
      <div className="relative z-10 overflow-x-hidden">
        <Hero />

        <div className="relative">
          {/* Gradient fade between sections for smoothness */}
          <Timeline />
        </div>

        <Gallery />
        <LoveLetter />

        <footer className="py-8 text-center text-slate-400 text-sm font-light">
          Built with Love | 9th Anniversary
        </footer>
      </div>
    </main>
  );
}
