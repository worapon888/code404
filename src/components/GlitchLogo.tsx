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

  // Shader time animate
  useFrame(({ clock }) => {
    if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // Animate in (เฉพาะรอบแรก)
  useEffect(() => {
    if (!isLoaded || !meshRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.transparent = true;
      meshRef.current.material.opacity = 0;
    }

    const yPosition = -0.3 + (viewport.height < 4 ? viewport.height * 0.05 : 0);
    const finalY = yPosition + 0.5;

    meshRef.current.position.set(0, finalY, 0);
    meshRef.current.scale.copy(defaultScale);

    if (htmlGroupRef.current) {
      htmlGroupRef.current.position.set(0, yPosition + 0.1, 0);
    }

    const tl = gsap.timeline();

    tl.fromTo(
      meshRef.current.position,
      { y: finalY - 0.6 },
      { y: finalY, duration: 2.8, ease: "sine.out" }
    );

    tl.to(
      meshRef.current.material,
      { opacity: 1, duration: 2.8, ease: "sine.out" },
      0
    );

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20, scale: 1.05 },
      { opacity: 1, y: 0, scale: 1, duration: 2.4, ease: "power2.out" },
      ">+0.3"
    );
  }, [isLoaded, viewport.height]);

  // Reset on first mount
  useEffect(() => {
    hasAnimated.current = false;

    if (meshRef.current?.material instanceof THREE.ShaderMaterial) {
      const mat = meshRef.current.material;
      mat.opacity = 0;
      mat.uniforms.uIntensity.value = 0.3;
      mat.uniforms.uTime.value = 0;
    }

    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 20, scale: 1.05 });
    }

    if (meshRef.current) {
      meshRef.current.scale.copy(defaultScale);
    }
  }, []);

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

      <group ref={htmlGroupRef}>
        <Html center>
          <p
            ref={textRef}
            className="text-sm md:text-base font-mono text-white/80 tracking-wide whitespace-nowrap inline-block backdrop-blur-sm mix-blend-screen text-center"
          >
            Building software that makes a difference.
          </p>
        </Html>
      </group>
    </group>
  );
}
