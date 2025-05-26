import { PointMaterial, Points } from "@react-three/drei";
import { useMemo } from "react";

export default function FloatingParticles({ count = 200 }) {
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 3.5; // ใกล้ portal มากขึ้น
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3; // สูงต่ำใกล้ศูนย์กลาง

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  return (
    <Points positions={positions} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}
