// ✅ FloatingParticlesGroup.tsx - Layered Particle Depth Effect
import { useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";



export function FloatingParticlesGroup({ count = 400, layer = 1 }) {

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius =
        layer === 1 ? 2.5 + Math.random() * 2.5 : 3.5 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count, layer]);

  return (
    <Points positions={positions} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={layer === 1 ? 0.03 : 0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={layer === 1 ? 0.5 : 0.3}
      />
    </Points>
  );
}
