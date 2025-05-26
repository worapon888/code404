import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function ComplexLines() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) groupRef.current.rotation.z = t * 0.25;

    // 🌀 วงกลมไหว
    rings.forEach((ring, i) => {
      const material = ring.material as THREE.LineBasicMaterial;
      material.opacity = 0.005 + Math.sin(t * 1.5 + i) * 0.01;
    });

    // 🔲 สี่เหลี่ยมพริ้ว
    squares.forEach((square, i) => {
      const material = square.material as THREE.LineBasicMaterial;
      material.opacity = 0.005 + Math.sin(t * 2 + i) * 0.02;
    });

    // ⬡ Polygon พริ้วบาง ๆ
    polygons.forEach((polygon, i) => {
      const material = polygon.material as THREE.LineBasicMaterial;
      material.opacity = 0.005 + Math.sin(t * 1.8 + i) * 0.01;
    });
  });

  // 🔘 วงกลมซ้อน (ใหญ่ขึ้น)
  const rings: THREE.Line[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = 2 + i * 0.25; // เพิ่มขนาดเริ่มต้น + ความห่างแต่ละวง
    const geometry = new THREE.RingGeometry(radius, radius + 0.01, 64);
    const material = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.02,
    });
    const ring = new THREE.Line(geometry, material);
    rings.push(ring);
  }

  const squares: THREE.Line[] = [];
  const squareCount = 50; // 👈 เพิ่มจำนวนให้ซ้อนจนถึงขอบ
  const startSize = 1.2; // ⬅️ เริ่มจากเล็กตรงกลาง
  const endSize = 10; // ⬅️ ไปจนถึงขอบจอ (ขึ้นกับ canvas)

  for (let i = 0; i < squareCount; i++) {
    const t = i / (squareCount - 1);
    const size = startSize * (1 - t) + endSize * t;

    const points = [
      new THREE.Vector3(-size / 2, -size / 2, 0),
      new THREE.Vector3(size / 2, -size / 2, 0),
      new THREE.Vector3(size / 2, size / 2, 0),
      new THREE.Vector3(-size / 2, size / 2, 0),
      new THREE.Vector3(-size / 2, -size / 2, 0),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.005 + (1 - t) * 0.03, // ชั้นในเข้ม ชั้นนอกจาง
    });

    const square = new THREE.Line(geometry, material);
    square.rotation.z = i * Math.PI * 0.06;
    squares.push(square);
  }

  // ✳️ เส้นเฉียงกลางวงกลม
  const diagonals = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const length = 3.6;
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    const points = [new THREE.Vector3(-x, -y, 0), new THREE.Vector3(x, y, 0)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.005,
    });
    const line = new THREE.Line(geometry, material);
    diagonals.push(line);
  }

  // ✴️ Polygon หลายเหลี่ยมกลางวง
  const polygons: THREE.Line[] = [];
  for (let i = 0; i < 6; i++) {
    const sides = 12;
    const radius = 1.6 + i * 0.1;
    const points = [];
    for (let j = 0; j <= sides; j++) {
      const a = (j / sides) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.01,
    });
    const polygon = new THREE.Line(geometry, material);
    polygon.rotation.z = (i * Math.PI) / 12;
    polygons.push(polygon);
  }

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[1.3, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>
      {diagonals.map((line, idx) => (
        <primitive key={`diag-${idx}`} object={line} />
      ))}
      {polygons.map((poly, idx) => (
        <primitive key={`poly-${idx}`} object={poly} />
      ))}
      {squares.map((square, idx) => (
        <primitive key={`square-${idx}`} object={square} />
      ))}
      {rings.map((ring, idx) => (
        <primitive key={`ring-${idx}`} object={ring} />
      ))}
    </group>
  );
}
