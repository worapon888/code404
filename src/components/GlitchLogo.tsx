import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import "./GlitchMaterial";

export default function GlitchLogo({ isLoaded }: { isLoaded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const texture = useLoader(THREE.TextureLoader, "/code404logo.png");
  const hasAnimated = useRef(false);

  // ดึง viewport info เพื่อทำ responsive
  const { viewport } = useThree();

  // ปรับ scale และตำแหน่งตามขนาด viewport
  const baseScale = 0.7;
  const scaleFactor = baseScale * Math.min(viewport.width / 6, 1);
  const yPosition = -0.3 + (viewport.height < 4 ? viewport.height * 0.05 : 0);
  const finalY = yPosition + 0.5;

  // update shader uniform เวลาเล่นแอนิเมชัน
  useFrame(({ clock }) => {
    if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  useEffect(() => {
    if (!isLoaded || !meshRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.transparent = true;
      meshRef.current.material.opacity = 0;
    }

    const tl = gsap.timeline();

    // เริ่มต่ำกว่า แล้วลอยขึ้นถึงตำแหน่งที่สูงกว่าเดิม
    tl.fromTo(
      meshRef.current.position,
      { y: yPosition - 0.6 },
      { y: finalY, duration: 2.8, ease: "sine.out" }
    );

    // Fade-in พร้อมกับลอยขึ้น
    tl.to(
      meshRef.current.material,
      { opacity: 1, duration: 2.8, ease: "sine.out" },
      0 // รันพร้อมกับตำแหน่ง
    );

    // ข้อความขึ้นหลังโลโก้ลอยเสร็จ
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20, scale: 1.05 },
      { opacity: 1, y: 0, scale: 1, duration: 2.4, ease: "power2.out" },
      ">+0.3" // เริ่มหลังจากลอยโลโก้เสร็จ + delay 0.3 วินาที
    );

    // เพิ่มท่าค้างไว้ตำแหน่งนี้ได้เลย (ไม่ต้องทำอะไรเพิ่ม)
  }, [isLoaded, yPosition]);

  return (
    <group position={[0, 0, 0]}>
      <mesh
        ref={meshRef}
        position={[0, yPosition + 0.5, 0]}
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

      <Html position={[0, yPosition + 0.1, 0]} center>
        <p
          ref={textRef}
          className="text-sm md:text-base font-mono text-white/80 tracking-wide whitespace-nowrap inline-block backdrop-blur-sm mix-blend-screen text-center"
        >
          Building software that makes a difference.
        </p>
      </Html>
    </group>
  );
}
