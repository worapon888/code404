import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 700;

interface Particle {
  position: THREE.Vector3;
  speed: number;
}

export default function LightSpeedParticles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useRef<Particle[]>([]);

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.01, 0.01, 50, 7);
    geo.rotateX(Math.PI / 2); // หันให้ยืดตามแนว Z
    return geo;
  }, []);

  useEffect(() => {
    if (!active) return;
    particles.current = []; // ล้างก่อน spawn ใหม่
  }, [active]);

  useFrame(({ camera, size }) => {
    if (!active || !meshRef.current) return;

    camera.updateMatrixWorld();
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir).normalize(); // กล้องมองไปทางไหน
    const direction = dir.negate(); // กลับทางเข้าหากล้อง
    const camPos = camera.position.clone();

    const perspectiveCam = camera as THREE.PerspectiveCamera;
    const fov = (perspectiveCam.fov * Math.PI) / 180;

    const height = 2 * Math.tan(fov / 2) * Math.abs(15); // คำนวณขนาดจอที่ระยะลึก -15
    const width = height * (size.width / size.height);

    // ✅ Spawn ตอนแรก
    if (particles.current.length === 0) {
      for (let i = 0; i < COUNT; i++) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * width * 1.5,
          (Math.random() - 0.5) * height * 1.5,
          0
        );
        const spawn = direction
          .clone()
          .multiplyScalar(-15)
          .add(offset)
          .add(camPos);

        particles.current.push({
          position: spawn,
          speed: 0.3 + Math.random() * 0.6, // ✅ ช้าลง → อยู่ในเฟรมนานขึ้น
        });
      }
    }

    // ✅ เคลื่อนและ reset
    for (let i = 0; i < COUNT; i++) {
      const p = particles.current[i];
      p.position.add(direction.clone().multiplyScalar(p.speed));

      const dist = p.position.distanceTo(camPos);
      if (dist < 1.5) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * width * 1.5,
          (Math.random() - 0.5) * height * 1.5,
          0
        );
        const reset = direction
          .clone()
          .multiplyScalar(-25)
          .add(offset)
          .add(camPos);
        p.position.copy(reset);
      }

      dummy.position.copy(p.position);
      dummy.lookAt(p.position.clone().add(dir)); // ให้เส้นหันไปทางที่มันพุ่ง
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, COUNT]}>
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
