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
  onClose,
}: {
  show: boolean;

  setShowWarpEffect: (v: boolean) => void;
  onClose: () => void;
}) {
  const { camera } = useThree();
  const htmlRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const charRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [, setReadyToSpawn] = useState(false);
  const { gl } = useThree(); // ✅ ดึง canvas element จริง

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);

    const tl = gsap.timeline({
      onComplete: () => {
        onClose(); // ✅ ใช้ onClose แทน setShow(false)
        setIsExiting(false);
      },
    });

    // 1. Animate ตัวอักษรหายออกแบบ reverse
    tl.add(() => {
      charRefs.current.forEach((line, i) => {
        line.forEach((charEl, j) => {
          gsap.to(charEl, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.inOut",
            delay: i * 0.1 + j * 0.005,
          });
        });
      });
    }, 0); // เริ่มทันที

    // 2. Fade out กล่องหลังตัวอักษรเริ่มหาย
    tl.to(
      htmlRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      },
      ">+0.4" // ✅ รอประมาณ 0.4s
    );

    // 4. กล้องถอยจาก (2, 0.6, 1.5) → (0, 0, 4.5)
    tl.to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 6,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: () => camera.updateProjectionMatrix(),
      },
      ">+0.2"
    );

    // 5. กล้องหมุนกลับ: (-0.15, -0.9) → (0, 0)
    tl.to(
      camera.rotation,
      {
        x: 0,
        y: 0,
        duration: 1.6,
        ease: "sine.inOut",
      },
      "<"
    );
  };

  // Sync กล้องกับ group ของข้อความ
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

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

        const originalPos = new THREE.Vector3(2, 0.4, 0.5);

        // 👇 timeline สำหรับ shake เบา ๆ
        const shakeIntensity = 0.01;
        const shakeTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });

        shakeTl.to(camera.position, {
          x: `+=${shakeIntensity}`,
          y: `-=${shakeIntensity}`,
          z: `+=${shakeIntensity}`,
          duration: 0.04,
          ease: "sine.inOut",
        });
        shakeTl.to(camera.position, {
          x: `-=${shakeIntensity}`,
          y: `+=${shakeIntensity}`,
          z: `-=${shakeIntensity}`,
          duration: 0.04,
          ease: "sine.inOut",
        });

        tl.to(
          camera.position,
          {
            x: originalPos.x,
            y: originalPos.y,
            z: originalPos.z,
            duration: 2,
            ease: "power3.inOut",
            onStart: () => {
              setShowWarpEffect(true);
              setTimeout(() => setShowWarpEffect(false), 1500);
              setTimeout(() => setReadyToSpawn(true), 500);

              // ✅ blur แบบนุ่ม ๆ
              gsap.fromTo(
                gl.domElement,
                { filter: "blur(1px)" },
                {
                  filter: "blur(0px)",
                  duration: 0.4,
                  ease: "power2.out",
                  delay: 0.2,
                }
              );

              // ✅ เริ่ม shake และหยุดหลัง 600ms
              shakeTl.play();
              setTimeout(() => {
                shakeTl.kill();
                camera.position.copy(originalPos);
              }, 500);
            },
          },
          ">"
        );

        // ✨ Animate ตัวอักษร
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

  return (
    <group ref={groupRef} position={[14, -1, -8]}>
      <Html transform>
        <div
          ref={htmlRef}
          id="aboutus"
          aria-label="About Us"
          className="
    relative flex flex-col items-center justify-center 
    min-h-screen text-white font-mono 
    backdrop-blur-md bg-black/40 rounded-xl shadow-xl 
    px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 
    w-[90vw] max-w-3xl mx-auto
    scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-65
  "
          style={{
            opacity: 0,
            pointerEvents: "auto",
            zIndex: 9999,
            fontSize: "0.6rem", // ✅ ลดขนาดลงจาก 0.95
            lineHeight: "1.5rem",
          }}
        >
          {/* 🔙 ปุ่มย้อนกลับ */}
          <button
            onClick={handleExit}
            className="
    cursor-pointer absolute left-[5rem] top-[4.5rem]
    px-3 py-1 rounded bg-white/10 hover:bg-white/20
    text-sm text-white shadow transition z-20
  "
          >
            ← Back
          </button>

          <div className="w-full text-center text-white space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-cyan-300 drop-shadow-lg mb-6">
              About Us
            </h1>

            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed tracking-wide hover:text-white transition duration-300"
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
