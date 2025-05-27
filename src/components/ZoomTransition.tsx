"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ✅ แยก useFrame ไปไว้ใน component ที่รันภายใน <Canvas>
function BurstParticles({
  velocities,
  positions,
}: {
  velocities: THREE.Vector3[];
  positions: Float32Array;
}) {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!particlesRef.current) return;

    const pos = particlesRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < velocities.length; i++) {
      const i3 = i * 3;
      pos.array[i3] += velocities[i].x * 0.02;
      pos.array[i3 + 1] += velocities[i].y * 0.02;
      pos.array[i3 + 2] += velocities[i].z * 0.02;
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00ffff" size={0.08} />
    </points>
  );
}

export default function ZoomTransition({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [done, setDone] = useState(false);

  const particleCount = 800;

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 0.1;
      arr[i3 + 1] = (Math.random() - 0.5) * 0.1;
      arr[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return arr;
  }, []);

  const velocities = useMemo(() => {
    const arr = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        )
      );
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!cameraRef.current || !groupRef.current) return () => {};

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setDone(true);
          onComplete();
        }, 200);
      },
    });

    tl.to(cameraRef.current.position, {
      z: 0.5,
      duration: 2.4,
      ease: "power2.inOut",
    });

    tl.to(
      groupRef.current.position,
      {
        z: -2,
        duration: 2.4,
        ease: "power2.inOut",
      },
      "<"
    );

    return () => tl.kill();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[999]">
      {!done && (
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <perspectiveCamera ref={cameraRef} position={[0, 0, 6]} />

          <group ref={groupRef}>
            <BurstParticles velocities={velocities} positions={positions} />
          </group>
        </Canvas>
      )}
    </div>
  );
}
