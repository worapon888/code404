"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import ComplexLines from "./ComplexLines";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// ✅ Canvas background with Bloom & Suspense
function CanvasBG() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true }}
      className="absolute inset-0 z-0"
    >
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <ComplexLines />
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: 60, scale: 1.1 },
        {
          opacity: 1, // ✅ ชัดเจนขึ้น
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
          opacity: 0.7, // ✅ ยังเบาอยู่แต่ไม่จางเกินไป
          y: 0,
          duration: 1.8,
          delay: 1.2,
          ease: "power2.out",
        }
      );
    }, containerRef); // ✅ สร้าง context ให้ชัดเจน

    return () => ctx.revert(); // ✅ Cleanup animations
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden"
    >
      <CanvasBG />

      {/* Centered Text Content */}
      <div className="absolute z-10 text-center space-y-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={logoRef} className="inline-block">
          <Image
            src="/logo_code404.png"
            alt="Code404 Logo"
            width={420}
            height={200}
            className="w-auto h-auto mx-auto"
            priority
          />
        </div>

        <p
          ref={subRef}
          className="text-sm md:text-base font-mono text-white/70 tracking-wide backdrop-blur-sm mix-blend-screen"
        >
          Creating software that feels.
        </p>
      </div>
    </section>
  );
}
