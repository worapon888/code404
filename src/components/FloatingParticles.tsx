import { PointMaterial, Points } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function FloatingParticles({ count = 200 }) {
  const pointsRef = useRef<THREE.Points>(null);

  // 💠 สร้างตำแหน่งแบบกระจายรอบกลาง portal
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 2; // กระจุกใกล้ศูนย์
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3; // ตรงกลางมากขึ้น

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  // 🌟 ใส่ shimmer effect ให้ดาวกระพริบเบา ๆ
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime();
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.15 + Math.abs(Math.sin(t * 1.2)) * 0.2;
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      position={[0, 0, 0.3]} // 🚩 ให้ลอยด้านหน้าจอนิดนึง
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.04} // 👈 เพิ่มขนาดให้เห็นชัดขึ้น
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}
