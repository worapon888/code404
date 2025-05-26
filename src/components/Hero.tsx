"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import ComplexLines from "./ComplexLines";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { FloatingParticlesGroup } from "./FloatingParticlesGroup";
import { ParallaxTiltEffect } from "./ParallaxTiltEffect";
import EnableSoundButton from "./AmbientSound";
import "./GlitchMaterial";
import GlitchLogo from "./GlitchLogo";
import WormholeCameraZoom from "./WormholeCameraZoom";
import FloatingBubbles from "./FloatingBubbles";

function CanvasBG({ isLoaded }: { isLoaded: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1 }}
      gl={{ antialias: true }}
      className="absolute inset-0 z-0"
    >
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <FloatingParticlesGroup layer={2} />
        <FloatingParticlesGroup layer={1} />
        <ComplexLines />
        <FloatingBubbles isLoaded={isLoaded} />
        <GlitchLogo isLoaded={isLoaded} />
        <WormholeCameraZoom isLoaded={isLoaded} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const subRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // simulate loading 0-100%
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 2; // เพิ่มแบบสุ่ม
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 300); // delay ก่อนแสดงโลโก้
      }
      setLoadingProgress(progress);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // animate in logo after loaded
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: 60, scale: 1.1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2.2,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 0.7,
          y: 0,
          duration: 1.8,
          delay: 1.2,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden"
    >
      <EnableSoundButton />
      <ParallaxTiltEffect>
        <CanvasBG isLoaded={isLoaded} />
      </ParallaxTiltEffect>

      {/* 🔵 Loading screen */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center text-white space-y-4">
          <p className="text-sm font-mono tracking-wide">
            Loading {Math.floor(loadingProgress)}%
          </p>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 🔥 Logo + tagline after load */}
    </section>
  );
}
