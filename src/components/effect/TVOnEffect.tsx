"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// ✅ สร้าง Shader Material แบบไม่ใส่ options ที่ 4
const TVShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 1,
    uResolution: new THREE.Vector2(),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform float uOpacity;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      float dist = distance(vUv, vec2(0.5));
      float alpha = smoothstep(0.4, 0.0, dist) * uOpacity;
      float pulse = sin(uTime * 10.0) * 0.1;
      float glow = smoothstep(0.3 + pulse, 0.0, dist);
      vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(0.0), glow);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

TVShaderMaterial.key = "tvShaderMaterial";
extend({ TVShaderMaterial });

export default function TVOnEffect() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<InstanceType<typeof TVShaderMaterial>>(null);

  const material = useMemo(() => {
    const mat = new TVShaderMaterial();
    mat.transparent = true;
    mat.depthWrite = false;
    mat.blending = THREE.AdditiveBlending;
    return mat;
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  useEffect(() => {
    if (!materialRef.current || !meshRef.current) return;

    gsap.fromTo(
      materialRef.current.uniforms.uOpacity,
      { value: 1 },
      {
        value: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.1,
        onComplete: () => {
          if (meshRef.current) {
            meshRef.current.visible = false;
          }
        },
      }
    );
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0.01]}>
      <planeGeometry args={[20, 20]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}
