"use client";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { animateEnterShowcase, animateExit } from "./ShowcaseCameraAnimation";

export default function ShowcaseSectionInsideCanvas({
  show,
  setShowWarpEffect,
  onClose,
}: {
  show: boolean;
  setShowWarpEffect: (v: boolean) => void;
  onClose: () => void;
}) {
  const { camera, gl } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const renderer = gl as THREE.WebGLRenderer;

  const htmlRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [, setReadyToSpawn] = useState(false);

  // ให้ group ติดตาม quaternion กล้องตลอดเวลา
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  useEffect(() => {
    if (!show) return;

    const timeout = setTimeout(() => {
      animateEnterShowcase({
        camera: perspectiveCamera,
        gl: renderer,
        htmlRef,
        charRefs,
        setShowWarpEffect,
        setReadyToSpawn,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [show]);

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);

    animateExit({
      camera: perspectiveCamera,
      htmlRef,
      charRefs,
      onComplete: () => {
        onClose();
        setIsExiting(false);
      },
    });
  };

  return (
    <group ref={groupRef} position={[-13, -1, -8]}>
      <Html transform>
        <div
          ref={htmlRef}
          id="showcase"
          aria-label="Showcase"
          className="relative flex flex-col items-center justify-center min-h-screen text-white font-mono backdrop-blur-md bg-black/40 rounded-xl shadow-xl px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 w-[70vw] sm:w-[90vw] max-w-4xl mx-auto scale-[0.5] sm:scale-[0.3] md:scale-[0.6] lg:scale-65"
          style={{
            opacity: 0,
            pointerEvents: "auto",
            zIndex: 9999,
            fontSize: "0.6rem",
            lineHeight: "1.5rem",
          }}
        >
          <button
            onClick={handleExit}
            className="cursor-pointer absolute left-1/8 -translate-y-[19rem] px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm text-white shadow transition z-20"
          >
            ← Back
          </button>

          {/* 📦 Content ของ Showcase ยังไม่ใส่ */}
          <div className="text-xl text-center">
            Coming Soon: Showcase Content
          </div>
        </div>
      </Html>
    </group>
  );
}
