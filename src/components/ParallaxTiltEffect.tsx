"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function ParallaxTiltEffect({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      gsap.to(el, {
        rotateX: -y,
        rotateY: x,
        transformPerspective: 800,
        transformOrigin: "center",
        ease: "power2.out",
        duration: 0.5,
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {children}
    </div>
  );
}

export default ParallaxTiltEffect;
