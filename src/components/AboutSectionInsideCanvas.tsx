"use client";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";

export default function AboutSectionInsideCanvas({ show }: { show: boolean }) {
  const { camera, gl } = useThree();
  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !htmlRef.current) return;

    console.log("🎥 เริ่มแอนิเมชันกล้อง + ข้อความ");

    const tl = gsap.timeline();

    // กล้อง
    tl.to(camera.position, {
      z: 4.5,
      duration: 1.5,
      ease: "power2.out",
    });

    tl.to(
      camera.rotation,
      {
        y: -0.9,
        x: -0.15,
        duration: 1.6,
        ease: "sine.inOut",
      },
      "<"
    );

    tl.to(camera.position, {
      x: 2,
      y: 0.6,
      z: 1.5,
      duration: 2,
      ease: "power3.inOut",
    });

    tl.fromTo(
      htmlRef.current,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power2.out",
      },
      ">" // เริ่มหลังกล้อง
    );
  }, [show]);

  useEffect(() => {
    const canvas = gl.domElement;
    gsap.fromTo(
      canvas.style,
      { filter: "contrast(1) brightness(1)" },
      {
        filter: "contrast(2.8) brightness(1.5)",
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        ease: "rough({ strength: 1, points: 20, randomize: true })",
      }
    );
  }, []);

  return (
    <Html
      fullscreen
      ref={htmlRef}
      style={{
        opacity: 0,
        pointerEvents: "auto",
        zIndex: 9999,
        position: "absolute", // เพิ่มแน่ใจว่าอยู่บนสุด
      }}
    >
      <div className="flex flex-col items-center justify-center h-screen text-white font-mono backdrop-blur-sm bg-black/30">
        <h1 className="text-5xl font-bold mb-3">ABOUT CODE404</h1>
        <p className="text-lg max-w-xl text-center opacity-80">
          We bend reality with immersive UI. Code404 is a portal, not a page.
        </p>
      </div>
    </Html>
  );
}
