"use client";

import { useMemo, useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen({
  progress,
  onComplete,
}: {
  progress: number;
  onComplete?: () => void;
}) {
  const clampedProgress = useMemo(
    () => Math.min(Math.floor(progress), 100),
    [progress]
  );
  const logoRef = useRef<HTMLHeadingElement>(null);
  const hasFired = useRef(false);

  useEffect(() => {
    if (clampedProgress >= 100 && !hasFired.current) {
      hasFired.current = true;

      // ✅ แจ้งว่า render 100% เสร็จแล้ว
      setTimeout(() => {
        onComplete?.();
      }, 400); // ให้เวลา UI แสดงเลข 100% จริง

      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          }
        );
      }
    }
  }, [clampedProgress, onComplete]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-white space-y-8 overflow-hidden">
      {/* Pulse Rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-400/10 animate-ping-slow blur-2xl" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-400/20 animate-pulse blur-xl" />

      {/* Logo */}
      <h1
        ref={logoRef}
        className="relative z-10 text-4xl font-mono text-cyan-300 font-bold tracking-widest animate-glitch drop-shadow-lg glow-holo"
      >
        CODE404
      </h1>

      {/* % */}
      <p className="text-white/80 font-mono text-sm animate-flicker tracking-wide z-10">
        Loading {clampedProgress}%
      </p>

      {/* Progress Bar */}
      <div className="w-64 h-2 rounded-full bg-cyan-300/10 overflow-hidden relative z-10 shadow-inner shadow-cyan-500/20">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-white/70 to-cyan-400 animate-progress-glow"
          style={{ width: `${clampedProgress}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}
