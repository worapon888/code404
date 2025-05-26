import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import "./GlitchMaterial";

export default function GlitchLogo({ isLoaded }: { isLoaded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const texture = useLoader(THREE.TextureLoader, "/code404logo.png");

  useFrame(({ clock }) => {
    if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // ✅ ใส่ motion หลังโหลด
  useEffect(() => {
    if (!isLoaded || !meshRef.current) return;

    gsap.fromTo(
      meshRef.current.material,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        delay: 2.2, // หลังฟองรวมตัว
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20, scale: 1.05 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    gsap.to(textRef.current, {
      x: "+=1",
      duration: 0.05,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.2,
    });
  }, [isLoaded]);

  const scaleFactor = 0.7;

  return (
    <group position={[0, 0, 0]}>
      {/* ✅ โลโก้ Glitch มี shader */}
      <mesh
        ref={meshRef}
        position={[0, 0.15, 0]}
        scale={[0.35 * scaleFactor, 0.15 * scaleFactor, 1]}
      >
        <planeGeometry args={[6, 4]} />
        <glitchMaterial
          attach="material"
          uTime={0}
          uIntensity={0.3}
          uTexture={texture}
        />
      </mesh>

      {/* ❌ ไม่มี motion ใด ๆ กับข้อความนี้ */}
      <Html position={[0, -0.2, 0]} center>
        <p
          ref={textRef}
          className="text-sm md:text-base font-mono text-white/80 tracking-wide whitespace-nowrap inline-block backdrop-blur-sm mix-blend-screen text-center"
        >
          Creating software that feels.
        </p>
      </Html>
    </group>
  );
}
