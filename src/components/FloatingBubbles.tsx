// components/FloatingBubbles.tsx
import { useEffect, useRef } from "react";
import { InstancedMesh } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
const COUNT = 250;

export default function FloatingBubbles({ isLoaded }: { isLoaded: boolean }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  const velocities = useRef<THREE.Vector3[]>(
    Array.from({ length: COUNT }, () => new THREE.Vector3())
  );
  const basePositions = useRef<THREE.Vector3[]>([]);

  const initialPositions = useRef<THREE.Vector3[]>([]);
  const { mouse, camera } = useThree();

  const raycaster = useRef(new THREE.Raycaster());

  // สร้างตำแหน่งฟองแบบกระจาย
  useEffect(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6;
      const pos = new THREE.Vector3(x, y, z);
      positions.push(pos);
    }
    initialPositions.current = positions.map((p) => p.clone()); // ตัวใช้งานจริง
    basePositions.current = positions; // สำรองไว้
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

    // ใช้ raycaster แปลงตำแหน่งเมาส์
    raycaster.current.setFromCamera(mouse, camera);
    const mousePos = new THREE.Vector3();
    raycaster.current.ray.at(6, mousePos); // เลือกระยะประมาณ 6 หน่วย (ใกล้ขอบเขตฟอง)

    for (let i = 0; i < COUNT; i++) {
      const base = initialPositions.current[i];
      if (!base) continue;

      const velocity = velocities.current[i];

      // คำนวณระยะทางระหว่างฟองกับตำแหน่งเมาส์ในโลก
      const distance = base.distanceTo(mousePos);

      if (distance < 1.2) {
        const forceDir = base.clone().sub(mousePos).normalize();
        const strength = (1.2 - distance) * 0.12;
        velocity.add(forceDir.multiplyScalar(strength));
      }

      // อัปเดตตำแหน่งด้วย velocity และลดแรงด้วย damping
      base.add(velocity);
      velocity.multiplyScalar(0.92);

      // เพิ่ม motion ลอยขึ้นลงเบา ๆ
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
