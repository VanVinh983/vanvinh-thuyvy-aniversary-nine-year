"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1500;

export function LoveShape() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 1. Generate Target Positions
  const { heartPositions, infinityPositions, initialRandomPositions } =
    useMemo(() => {
      const heart = [];
      const infinity = [];
      const random = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Random Start
        random.push(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        );

        // HEART SHAPE
        // Parametric equations for a heart
        // x = 16sin^3(t)
        // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
        // We need 3D density, so we add some randomness (thickness)
        const t = Math.random() * Math.PI * 2;
        // Rejection sampling or just simple distribution
        // Let's use simple distribution for speed + noise
        const r = 0.5; // scale
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
        // Add minimal Z thickness
        const hz = (Math.random() - 0.5) * 4;

        // Scale down fitting
        heart.push(hx * 0.15, hy * 0.15, hz * 0.5);

        // INFINITY SHAPE (Lemniscate)
        // x = (a * cos(t)) / (1 + sin^2(t))
        // y = (a * sin(t) * cos(t)) / (1 + sin^2(t))
        const a = 8;
        const it = i * 0.1; // spread points
        const ix = (a * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
        const iy =
          (a * Math.sin(t) * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
        const iz = (Math.random() - 0.5) * 3; // Thickness
        infinity.push(ix, iy, iz);
      }

      return {
        heartPositions: new Float32Array(heart),
        infinityPositions: new Float32Array(infinity),
        initialRandomPositions: new Float32Array(random),
      };
    }, []);

  // State for current visual particles
  // We don't store "current" positions in JS array to avoid GC, we compute in useFrame or update logic.
  // Actually simplest is to just lerp between semantic targets.

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    // Scroll interaction: client-side safe check
    let morphFactor = 0; // 0 = Heart, 1 = Infinity
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      // As we reach bottom (end of 9 years), morph to Infinity (Forever)
      const progress = Math.min(Math.max(scrollY / (maxScroll * 0.8), 0), 1);
      morphFactor = progress;
    }

    // Interactive Hover Override (optional: click implies full Infinity)
    if (hovered) {
      // morphFactor = 0.5; // mixed state?
    }

    // Update Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Target 1: Heart
      const hx = heartPositions[i3];
      const hy = heartPositions[i3 + 1];
      const hz = heartPositions[i3 + 2];

      // Target 2: Infinity
      const ix = infinityPositions[i3];
      const iy = infinityPositions[i3 + 1];
      const iz = infinityPositions[i3 + 2];

      // Lerp
      // We add a 'pulse' to the heart state
      const pulse = 1 + Math.sin(time * 2) * 0.05 * (1 - morphFactor); // Only pulse when near heart state

      let cx = THREE.MathUtils.lerp(hx * pulse, ix, morphFactor);
      let cy = THREE.MathUtils.lerp(hy * pulse, iy, morphFactor);
      let cz = THREE.MathUtils.lerp(hz * pulse, iz, morphFactor);

      // Add some noise/floating
      cx += Math.sin(time + i) * 0.05;
      cy += Math.cos(time + i * 0.5) * 0.05;
      cz += Math.sin(time * 0.5 + i) * 0.05;

      dummy.position.set(cx, cy, cz);

      // Scale particles - smaller for subtle look
      const s = 0.08;
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      position={[0, 0, -45]} // Positioned deep in the scene, "The Destination"
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#fb7185"
        toneMapped={false}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}
