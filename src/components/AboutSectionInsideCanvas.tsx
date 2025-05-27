"use client";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

const paragraphs = [
  "I’m a self-taught developer with a background in music and a mindset shaped by design, rhythm, and motion.",
  "My work sits at the intersection of aesthetic precision and technical depth — where every pixel, transition, and interaction is crafted to feel intentional.",
  "As a solo developer, I specialize in creating immersive front-end experiences. I design the UX, write the code, animate every detail, and build products that don’t just function — they resonate.",
  "I believe great interfaces should feel more like portals than pages. That’s why I work with tools like Next.js, GSAP, and WebGL, combining performance with emotion to create web experiences that leave an impression.",
  "I’m not here to make generic templates. I’m here to build distinctive, high-signal products — the kind that clients remember, users return to, and other devs wish they built.",
  "Let’s raise the bar.",
];

export default function AboutSectionInsideCanvas({
  show,
  setShowWarpEffect,
}: {
  show: boolean;
  setShowWarpEffect: (v: boolean) => void;
}) {
  const { camera, gl } = useThree();
  const htmlRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const charRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);

  // Sync กล้องกับ group ของข้อความ
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });
  const [, setReadyToSpawn] = useState(false);


  useEffect(() => {
    if (!show) return;

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.to(camera.position, {
          z: 4.5,
          duration: 1.5,
          ease: "power2.out",
        });

        tl.to(camera.rotation, {
          y: -0.9,
          x: -0.15,
          duration: 1.6,
          ease: "sine.inOut",
        });

        tl.to(
          camera.position,
          {
            x: 2,
            y: 0.6,
            z: 1.5,
            duration: 2,
            ease: "power3.inOut",
            onStart: () => {
              // ✅ แจ้ง parent ให้แสดงเอฟเฟกต์
              setShowWarpEffect(true);
              setTimeout(() => setShowWarpEffect(false), 1500);
              setTimeout(() => setReadyToSpawn(true), 500);
            },
          },
          ">"
        );

        // Animate ตัวอักษร
        tl.add(() => {
          gsap.to(htmlRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          charRefs.current.forEach((line, i) => {
            line.forEach((charEl, j) => {
              gsap.fromTo(
                charEl,
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power4.out",
                  delay: i * 0.2 + j * 0.01,
                }
              );
            });
          });
        });
      }, htmlRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, [show, setShowWarpEffect]);

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;
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
    <group ref={groupRef} position={[14, -1, -8]}>
      <Html transform>
        <div
          ref={htmlRef}
          className="flex flex-col items-center justify-center h-screen text-white font-mono backdrop-blur-md bg-black/40 rounded-xl shadow-xl px-8 py-12 "
          style={{
            opacity: 0,
            pointerEvents: "auto",
            zIndex: 9999,
            fontSize: "0.95rem",
            lineHeight: "1.6rem",
            transform: "scale(0.68)",
          }}
        >
          <div className="max-w-xl w-full text-center text-white space-y-5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-cyan-300 drop-shadow-lg mb-6">
              About Us
            </h1>

            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm md:text-base text-white/90 leading-relaxed tracking-wide hover:text-white transition duration-300"
              >
                {para.split("").map((char, j) => (
                  <span
                    key={j}
                    ref={(el) => {
                      if (!charRefs.current[i]) charRefs.current[i] = [];
                      charRefs.current[i][j] = el;
                    }}
                    style={{ display: "inline-block", opacity: 0 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

