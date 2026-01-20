"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { FloatingParticles } from "./FloatingParticles";
import { Suspense } from "react";
import * as THREE from "three";
import { Timeline3D } from "./Timeline3D";
import { MemoryGallery } from "./MemoryGallery";
import { LoveShape } from "./LoveShape";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Rig() {
  useFrame((state) => {
    // Scroll effect - move camera deeper (Fly-through)
    // Safe check for window existence (client-side)
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Move camera deeper to reveal the gallery and LoveShape
      // Timeline (10 to -10), Gallery (-20 to -140), LoveShape (-45)
      // Stop at -35 so the LoveShape (-45) is visible in front of us as the finale background
      const targetZ = 20 - scrollProgress * 55;
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        targetZ,
        0.025, // Slower, heavier feel
      );
    }

    // Smooth camera X/Y movement based on mouse
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.mouse.x * 2,
      0.025,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.mouse.y * 2,
      0.025,
    );

    // Look forward relative to current position to create "fly through" effect
    state.camera.lookAt(0, 0, state.camera.position.z - 10);
  });
  return null;
}

export default function MainScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 5, 60]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#fb7185" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={1}
            color="#facc15"
          />

          <FloatingParticles count={100} color="#fecdd3" />

          <Timeline3D />
          <MemoryGallery />
          <LoveShape />

          <Rig />
          <Environment preset="sunset" />

          <EffectComposer>
            <Bloom
              luminanceThreshold={1}
              intensity={1.5}
              levels={9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
