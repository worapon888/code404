// components/FloatingBubbles.tsx
import { useEffect, useRef } from "react";
import { InstancedMesh } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const COUNT = 250;

export default function FloatingBubbles({ isLoaded }: { isLoaded: boolean }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  const initialPositions = useRef<THREE.Vector3[]>([]);

  // สร้างตำแหน่งฟองแบบกระจาย
  useEffect(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6;
      positions.push(new THREE.Vector3(x, y, z));
    }
    initialPositions.current = positions;
  }, []);

  // Animate: รวมตัวเข้าโลโก้เมื่อโหลดเสร็จ
  useEffect(() => {
    if (!isLoaded || !meshRef.current) return;

    initialPositions.current.forEach((start, i) => {
      const temp = start.clone();
      const target = new THREE.Vector3(0, 0.15, 0);

      gsap.to(temp, {
        x: target.x,
        y: target.y,
        z: target.z,
        delay: Math.random() * 0.4,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: () => {
          dummy.position.copy(temp);
          dummy.updateMatrix();
          meshRef.current!.setMatrixAt(i, dummy.matrix);
          meshRef.current!.instanceMatrix.needsUpdate = true;
        },
      });
    });
  }, [isLoaded]);

  // ฟองลอยขึ้นลงเบา ๆ
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    for (let i = 0; i < COUNT; i++) {
      const base = initialPositions.current[i] || new THREE.Vector3();
      dummy.position.set(
        base.x,
        base.y + Math.sin(clock.elapsedTime * 2 + i) * 0.1,
        base.z
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshStandardMaterial
        color={"#ffffff"}
        emissive={"#00ffff"}
        emissiveIntensity={0.7}
        roughness={0.2}
        metalness={0.3}
      />
    </instancedMesh>
  );
}
