"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SceneCanvas from "@/components/about/SceneCanvas";
import AboutContent from "@/components/about/AboutContent";
import BackButton from "@/components/about/BackButton";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    if (!containerRef.current || !maskRef.current) return;

    // ✅ เอฟเฟกต์เปิดทีวี
    tl.set(maskRef.current, {
      scaleY: 2.5,
      opacity: 1,
      transformOrigin: "center",
    });
    tl.to(maskRef.current, {
      scaleY: 0.1,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });

    // ✅ Animate คอนเทนต์ให้ scale จากกลางแบบ hologram
    tl.set(containerRef.current, { opacity: 0, scaleY: 0.8 });
    tl.to(
      containerRef.current,
      {
        opacity: 1,
        scaleY: 1,
        duration: 1.4,
        ease: "power2.out",
      },
      0.3
    );
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {/* แสงวาบกลางจอ */}
      <div
        ref={maskRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 255, 255, 0.8) 0%, transparent 60%)",
          filter: "blur(60px)",
          mixBlendMode: "screen", // ✅ ให้กลืนกับพื้นหลังแบบแสงจริง
          transform: "scaleY(1)",
        }}
      />

      {/* คอนเทนต์หลัก */}
      <div ref={containerRef} className="w-full h-full beam-glow">
        <BackButton />
        <SceneCanvas />
        <AboutContent />
      </div>
    </div>
  );
}
