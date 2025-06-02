"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import "./textures/GlitchMaterial";

export default function GlitchLogo({ isLoaded }: { isLoaded: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const htmlGroupRef = useRef<THREE.Group>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const hireBtnRef = useRef<HTMLButtonElement>(null);
  const texture = useLoader(THREE.TextureLoader, "/code404logo.png");
  const hasAnimated = useRef(false);
  const { viewport } = useThree();

  const baseScale = 0.7;
  const scaleFactor = baseScale * Math.min(viewport.width / 6, 1);
  const defaultScale = new THREE.Vector3(
    0.35 * scaleFactor,
    0.15 * scaleFactor,
    1
  );

  // 🔄 Animate shader uTime
  useFrame(({ clock }) => {
    if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // ♻️ Reset animation flag when isLoaded changes
  useEffect(() => {
    if (isLoaded) {
      hasAnimated.current = false;
    }
  }, [isLoaded]);

  // ▶️ Animate logo and HTML content
  useEffect(() => {
    if (!isLoaded || hasAnimated.current || !meshRef.current) return;
    hasAnimated.current = true;

    const mesh = meshRef.current;
    const mat = mesh.material as THREE.ShaderMaterial;
    const yBase = -0.3 + (viewport.height < 4 ? viewport.height * 0.05 : 0);
    const logoY = yBase + 0.5;

    // 🛡️ Safe setup
    gsap.set(mesh.position, { y: logoY - 0.6 });
    gsap.set(mesh.scale, defaultScale);
    gsap.set(mat, { opacity: 0 });

    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 20, scale: 1.05 });
    }
    if (hireBtnRef.current) {
      gsap.set(hireBtnRef.current, { opacity: 0, y: 30, scale: 0.98 });
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(mesh.position, { y: logoY, duration: 1.6 }, 0);
        tl.to(mat, { opacity: 1, duration: 1.6 }, "<");

        if (textRef.current) {
          tl.to(
            textRef.current,
            { opacity: 1, y: 0, scale: 1, duration: 1.6 },
            ">+0.3"
          );
        }
        if (hireBtnRef.current) {
          tl.to(
            hireBtnRef.current,
            { opacity: 1, y: 0, scale: 1, duration: 1.4 },
            ">-0.2"
          );
        }
      });
    });
  }, [isLoaded, viewport.height]);

  if (!texture || !isLoaded) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[6, 4]} />
        <glitchMaterial
          attach="material"
          uTime={0}
          uIntensity={0.3}
          uTexture={texture}
          transparent
          opacity={1}
        />
      </mesh>

      <group ref={htmlGroupRef} position={[0, -0.3, 0]}>
        <Html center transform prepend zIndexRange={[100, 0]}>
          <div
            className="flex flex-col items-center mt-5 space-y-4"
            style={{
              transform: "scale(0.35)",
              transformOrigin: "center",
              padding: "2rem",
              fontSize: "20px",
            }}
          >
            <p
              ref={textRef}
              className="text-sm md:text-base font-mono text-white/80 tracking-wide whitespace-nowrap inline-block backdrop-blur-sm mix-blend-screen text-center opacity-0 translate-y-4 scale-105"
            >
              UX/UI & Frontend Dev — Clean design. Real code. Smooth experience.
            </p>

            <button
              ref={hireBtnRef}
              className="relative px-6 py-2 cursor-pointer text-sm md:text-base font-semibold text-white/90 border border-white/30 rounded-md backdrop-blur-md hover:bg-white/10 transition-colors duration-300 overflow-hidden group opacity-0 translate-y-6 scale-95"
              onClick={() => (window.location.href = "#contact")}
            >
              <span className="relative z-10">Explore My Work</span>

              {/* Light Beam Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-light-beam"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-light-beam-delayed"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent animate-cyan-beam"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent animate-cyan-beam-delayed"></div>

              <div className="absolute inset-0 border border-white/30 rounded-md animate-pulse"></div>
              <div className="absolute inset-0 border border-white/20 rounded-md animate-pulse-delayed"></div>
            </button>
          </div>
        </Html>
      </group>
    </group>
  );
}
