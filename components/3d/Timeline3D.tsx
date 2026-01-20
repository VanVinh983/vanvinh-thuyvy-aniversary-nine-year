"use client";

import { Line, Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const milestones = [
  { year: "Năm 1", title: "Ngày đầu tiên" },
  { year: "Năm 2", title: "Hẹn hò" },
  { year: "Năm 3", title: "Thấu hiểu" },
  { year: "Năm 4", title: "Khoảng cách" },
  { year: "Năm 5", title: "Giông bão" },
  { year: "Năm 6", title: "Đồng hành" },
  { year: "Năm 7", title: "Vững tin" },
  { year: "Năm 8", title: "Xây dựng" },
  { year: "Năm 9", title: "Mãi mãi" },
];

export function Timeline3D() {
  const [hovered, setHovered] = useState<number | null>(null);

  const points = useMemo(() => {
    return new Array(9).fill(0).map((_, i) => {
      // Gentle spiral/curve layout
      const t = i / 8; // 0 to 1
      const x = Math.sin(t * Math.PI * 2) * 3;
      const y = Math.cos(t * Math.PI * 2) * 2;
      // Spread from Z=10 down to Z=-10
      const z = 10 - i * 3;
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle floating animation for the whole timeline
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Connecting Line */}
      <Line
        points={points}
        color="#fb7185"
        lineWidth={2}
        transparent
        opacity={0.4}
      />

      {/* Nodes */}
      {points.map((point, i) => (
        <group key={i} position={point}>
          {/* Glowing core */}
          <mesh
            onPointerOver={() => setHovered(i)}
            onPointerOut={() => setHovered(null)}
          >
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color="#fb7185"
              emissive="#fb7185"
              emissiveIntensity={hovered === i ? 3 : 2}
              toneMapped={false}
            />
          </mesh>
          {/* Outer halo */}
          <mesh>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshBasicMaterial
              color="#fda4af"
              transparent
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>

          {/* Tooltip */}
          {hovered === i && (
            <Html distanceFactor={12}>
              <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-rose-100 min-w-[120px] text-center transform -translate-y-10 pointer-events-none">
                <div className="text-rose-500 font-bold text-xs">
                  {milestones[i].year}
                </div>
                <div className="text-slate-700 font-serif text-sm whitespace-nowrap">
                  {milestones[i].title}
                </div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
