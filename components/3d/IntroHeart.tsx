"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Parametric 3D heart function
function heartShape(u: number, v: number): THREE.Vector3 {
  const x = Math.pow(Math.sin(u), 3);
  const y =
    (13 * Math.cos(u) -
      5 * Math.cos(2 * u) -
      2 * Math.cos(3 * u) -
      Math.cos(4 * u)) /
    16;
  const z = v;

  return new THREE.Vector3(x * 0.8, (y - 0.5) * 0.8, z * 0.3);
}

export function IntroHeartCanvas({ onComplete }: { onComplete: () => void }) {
  const particleData = useMemo(() => {
    const data = [];
    const count = 5000;

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * 2;

      const surfacePoint = heartShape(u, v);
      const depth = Math.pow(Math.random(), 2);
      const initialPos = surfacePoint.clone().multiplyScalar(depth);

      const hue = 0.95 + Math.random() * 0.08;
      const saturation = 0.8 + Math.random() * 0.2;
      const lightness = 0.4 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(hue, saturation, lightness);

      // Random disperse velocity for each particle
      const disperseVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      )
        .normalize()
        .multiplyScalar(2 + Math.random() * 4);

      data.push({
        initialPos: initialPos.clone(),
        color,
        disperseVelocity,
        randomDelay: Math.random() * 0.2, // Random delay for staggered disperse effect
      });
    }
    return data;
  }, []);

  const positionsRef = useRef<Float32Array>(
    new Float32Array(particleData.length * 3),
  );
  const colorsRef = useRef<Float32Array>(
    new Float32Array(particleData.length * 3),
  );

  // Initialize positions and colors
  useMemo(() => {
    particleData.forEach((pt, i) => {
      positionsRef.current[i * 3] = pt.initialPos.x;
      positionsRef.current[i * 3 + 1] = pt.initialPos.y;
      positionsRef.current[i * 3 + 2] = pt.initialPos.z;

      colorsRef.current[i * 3] = pt.color.r;
      colorsRef.current[i * 3 + 1] = pt.color.g;
      colorsRef.current[i * 3 + 2] = pt.color.b;
    });
  }, [particleData]);

  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const heartbeatAudioRef = useRef<HTMLAudioElement | null>(null);

  const [beatCount, setBeatCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const disperseStartTimeRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);
  const [isDispersing, setIsDispersing] = useState(false);

  // Initialize heartbeat audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/heart-beat.mp3");
      audio.volume = 0.6; // Adjust volume as needed
      audio.preload = "auto";
      heartbeatAudioRef.current = audio;

      // Attempt to load the audio
      audio.load();
    }

    return () => {
      // Cleanup
      if (heartbeatAudioRef.current) {
        heartbeatAudioRef.current.pause();
        heartbeatAudioRef.current = null;
      }
    };
  }, []);

  // Function to play heartbeat sound
  const playHeartbeat = () => {
    if (heartbeatAudioRef.current) {
      // Reset audio to beginning and play
      heartbeatAudioRef.current.currentTime = 0;
      heartbeatAudioRef.current.play().catch((error) => {
        console.warn("Failed to play heartbeat sound:", error);
      });
    }
  };

  useFrame((state) => {
    if (!pointsRef.current || !geometryRef.current || !materialRef.current)
      return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;

    const BEAT_INTERVAL = 1.0;
    const TOTAL_BEATS = 9;
    const DISPERSE_DURATION = 2.0; // Duration of the disperse animation

    // BEATING PHASE
    if (!isDispersing) {
      const currentBeat = Math.floor(elapsed / BEAT_INTERVAL);

      // Update beat count
      if (currentBeat !== beatCount && currentBeat <= TOTAL_BEATS) {
        const newBeatCount = Math.min(currentBeat, TOTAL_BEATS);
        setBeatCount(newBeatCount);
        console.log(`❤️ Beat ${newBeatCount}/${TOTAL_BEATS}`);

        // Play heartbeat sound on each beat
        if (newBeatCount > 0 && newBeatCount <= TOTAL_BEATS) {
          playHeartbeat();
        }

        // Start disperse animation after the 9th beat
        if (newBeatCount === TOTAL_BEATS && !hasCompletedRef.current) {
          console.log("💫 Starting disperse animation...");
          setIsDispersing(true);
          disperseStartTimeRef.current = state.clock.elapsedTime;
        }
      }

      const beatProgress = (elapsed % BEAT_INTERVAL) / BEAT_INTERVAL;

      let beatIntensity = 0;
      if (beatProgress < 0.15) {
        beatIntensity = Math.sin((beatProgress / 0.15) * Math.PI * 0.5);
      } else if (beatProgress < 0.3) {
        beatIntensity = Math.cos(
          ((beatProgress - 0.15) / 0.15) * Math.PI * 0.5,
        );
      }

      const baseScale = 1.8;
      const pulseAmount = 0.15;
      const currentScale = baseScale + beatIntensity * pulseAmount;

      pointsRef.current.scale.setScalar(currentScale);
      pointsRef.current.rotation.y = elapsed * 0.15;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.3) * 0.1;
    }
    // DISPERSING PHASE
    else if (disperseStartTimeRef.current !== null) {
      const disperseElapsed =
        state.clock.elapsedTime - disperseStartTimeRef.current;
      const disperseProgress = Math.min(disperseElapsed / DISPERSE_DURATION, 1);

      // Ease out cubic for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - disperseProgress, 3);

      // Update particle positions
      const positions = positionsRef.current;
      particleData.forEach((particle, i) => {
        const staggeredProgress = Math.max(
          0,
          disperseProgress - particle.randomDelay,
        );
        const easedStagger =
          1 - Math.pow(1 - Math.min(staggeredProgress, 1), 3);

        positions[i * 3] =
          particle.initialPos.x + particle.disperseVelocity.x * easedStagger;
        positions[i * 3 + 1] =
          particle.initialPos.y + particle.disperseVelocity.y * easedStagger;
        positions[i * 3 + 2] =
          particle.initialPos.z + particle.disperseVelocity.z * easedStagger;
      });

      // Mark positions for update
      if (geometryRef.current.attributes.position) {
        geometryRef.current.attributes.position.needsUpdate = true;
      }

      // Fade out opacity
      materialRef.current.opacity = 0.85 * (1 - easeProgress);

      // Scale up slightly during disperse
      const disperseScale = 1.8 + easeProgress * 0.5;
      pointsRef.current.scale.setScalar(disperseScale);

      // Continue rotation for fluid motion
      pointsRef.current.rotation.y += 0.01;

      // Trigger completion when disperse animation is done
      if (disperseProgress >= 1 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        console.log("🎉 Disperse complete! Transitioning to main scene...");
        setTimeout(() => {
          onComplete && onComplete();
        }, 300);
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsRef.current, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorsRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.025}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
