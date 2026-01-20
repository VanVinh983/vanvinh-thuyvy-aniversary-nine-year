"use client";

import { Image, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useImageStore } from "@/store";

const memories = [
  ...[1, 2, 3, 4, 5].map((i) => ({
    src: `/images/${i}.JPG`,
    desc: "Những ngày đầu tiên...",
  })),
  ...Array.from({ length: 4 }, (_, i) => i + 6).map((i) => ({
    src: `/images/${i}.jpeg`,
    desc: "Từng chút một, mình hiểu nhau hơn.",
  })),
];

function FloatingImage({
  position,
  rotation,
  url,
  desc,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  url: string;
  desc: string;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);
  const setSelectedImage = useImageStore((state) => state.setSelectedImage);

  useFrame((state) => {
    if (!ref.current) return;

    // Gentle floating
    ref.current.position.y +=
      Math.sin(state.clock.elapsedTime + index * 100) * 0.002;

    // Mobile-friendly Interaction: Proximity Check
    // Instead of hover, we check if the camera is close to the image
    const dist = state.camera.position.distanceTo(ref.current.position);
    const isClose = dist < 25; // Activation range

    if (active !== isClose) setActive(isClose);
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Image
        url={url}
        scale={[3.5, 4.5, 1]} // Fixed scale - no zoom effect
        transparent
        opacity={active ? 1 : 0.3} // Fade out when far
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImage({
            src: url,
            alt: `Kỷ niệm ${index + 1}`,
            description: desc,
          });
        }}
        toneMapped={false}
      />
      {/* Optional: Add a subtle glowing frame or particle effect when active? 
          For now, just the zoom and lighting up is "interesting" enough as a drift-by effect. */}
    </group>
  );
}

export function MemoryGallery() {
  const items = useMemo(() => {
    return memories.map((mem, i) => {
      // Cylinder distribution logic
      const radius = 12 + Math.random() * 8; // Random radius 12-20
      const angle = (i / memories.length) * Math.PI * 2 * 2; // Wrap around twice
      const y = (Math.random() - 0.5) * 10; // Height variation
      const z = -20 - i * 5; // Spread deep into the scene starting from Z=-20

      return {
        ...mem,
        position: [
          Math.sin(angle) * radius,
          y,
          Math.cos(angle) * radius + z - 20, // push further back
        ] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number], // Face inward
      };
    });
  }, []);

  return (
    <group>
      {items.map((item, i) => (
        <FloatingImage
          key={i}
          index={i}
          url={item.src}
          position={item.position}
          rotation={item.rotation}
          desc={item.desc}
        />
      ))}
    </group>
  );
}
