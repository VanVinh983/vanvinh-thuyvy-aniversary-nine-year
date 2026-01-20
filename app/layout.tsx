import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "9 năm yêu thương",
  description:
    "Hành trình 9 năm yêu thương – từng khoảnh khắc, từng kỷ niệm, từng nhịp tim",
};

import { ImageModal } from "@/components/ui/ImageModal";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { IntroSequence } from "@/components/ui/IntroSequence";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <IntroSequence>{children}</IntroSequence>
        <ImageModal />
        <MusicPlayer />
        <div className="grain-overlay" />
      </body>
    </html>
  );
}
