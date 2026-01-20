import { create } from "zustand";

interface ImageState {
  selectedImage: { src: string; alt: string; description?: string } | null;
  setSelectedImage: (
    image: { src: string; alt: string; description?: string } | null,
  ) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  selectedImage: null,
  setSelectedImage: (image) => set({ selectedImage: image }),
}));
