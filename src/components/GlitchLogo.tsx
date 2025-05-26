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

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.transparent = true;
      meshRef.current.material.opacity = 0;
    }

    // ✅ โลโก้ค่อย ๆ ลอยขึ้นอย่างนุ่ม
    gsap.to(meshRef.current.position, {
      y: 0.15,
      duration: 2.8,
      delay: 1.0, // เพิ่ม breathing room ก่อนเริ่ม
      ease: "sine.out", // ลื่น ไม่กระชาก
    });

    // ✅ โลโก้ fade-in แบบลื่น
    gsap.to(meshRef.current.material, {
      opacity: 1,
      duration: 2.8,
      delay: 1.0,
      ease: "sine.out",
    });

    // ✅ ข้อความขึ้นตามอย่างนุ่ม
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20, scale: 1.05 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 2.4,
        delay: 3.0, // รอโลโก้จบก่อนค่อยขึ้นข้อความ
        ease: "power2.out",
      }
    );
  }, [isLoaded]);

  const scaleFactor = 0.7;

  return (
    <group position={[0, 0, 0]}>
      {/* ✅ โลโก้ Glitch มี shader */}
      <mesh
        ref={meshRef}
        position={[0, -0.3, 0]} // ⬅️ เริ่มต่ำลง
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
