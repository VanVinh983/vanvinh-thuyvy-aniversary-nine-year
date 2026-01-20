"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

interface Particle {
  t: number;
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  mx: number;
  my: number;
}

export function FloatingParticles({
  count = 100,
  color = "#ffd1dc",
}: FloatingParticlesProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    particles.current = temp;
  }, [count]);

  // Re-use Dummy Object to save memory
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;

    // Convert mouse to 3D space rough approximation for effect
    const mouseX = state.mouse.x * 10;
    const mouseY = state.mouse.y * 10;

    particles.current.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      let { t } = particle;

      // Update time (slower for gentle feel)
      t = particle.t += speed / 6;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Base Position
      let x =
        (particle.mx / 10) * a +
        xFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 1) * factor) / 10;
      let y =
        (particle.my / 10) * b +
        yFactor +
        Math.sin((t / 10) * factor) +
        (Math.cos(t * 2) * factor) / 10;
      const z =
        (particle.my / 10) * b +
        zFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 3) * factor) / 10;

      // Mouse Interaction (Simple Repulsion/Attraction)
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 4) {
        const force = (4 - dist) / 4;
        x -= dx * force * 0.5;
        y -= dy * force * 0.5;
      }

      // Update position
      dummy.position.set(x, y, z);

      // Update scale (pulsing effect)
      const scale = (1 + s) * 0.4; // Base scale
      dummy.scale.set(scale, scale, scale);

      // Update rotation
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <extrudeGeometry
          args={[
            new THREE.Shape()
              .moveTo(0.25, 0.25)
              .bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0)
              .bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35)
              .bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95)
              .bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35)
              .bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0)
              .bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25),
            {
              depth: 0.2,
              bevelEnabled: true,
              bevelThickness: 0.05,
              bevelSize: 0.05,
              bevelSegments: 2,
            },
          ]}
        ></extrudeGeometry>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </instancedMesh>
    </>
  );
}
