"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = `
uniform float uTime;
uniform vec2 uMouse;

varying float vWave;
varying vec3 vPosition;

void main() {
  vec3 pos = position;

  // 🌀 Warp จากระยะห่างระหว่าง mouse → vertex
  vec2 scaledMouse = uMouse * 20.0;     // ✨ match กับ world space grid
  vec2 delta = pos.xy - scaledMouse;
  float dist = length(delta);   // ระยะห่าง
  float force = 1.0 / (dist + 0.5);  // ยิ่งใกล้ยิ่งแรง

  // แรงดึงเบนพิกัด XY (ตามแนวตั้งฉากกับ delta)
  vec2 dir = normalize(vec2(-delta.y, delta.x)); 
  pos.xy += dir * force;

  // 🧵 ย้วยแบบเดิม
  float twistSpeed = 1.5;
  float waveSpeed = 2.5;

  float angle = uTime * twistSpeed + pos.x * 0.5 + pos.y * 0.4;
  float radius = 0.35 + 0.15 * sin(pos.x * 2.0 + uTime * 1.5);

  pos.x += cos(angle) * radius;
  pos.y += sin(angle + pos.x * 0.2) * radius * 0.8;

  // ripple เบา ๆ
  pos.z += sin(pos.x * 3.0 + uTime * waveSpeed) * 0.15;
  pos.z += cos(pos.y * 2.0 + uTime * 1.2) * 0.1;
  pos.z += sin(pos.x * 0.5 + uTime * 1.0) * 0.2;
pos.z += sin(pos.y * 0.5 + uTime * 1.3) * 0.2;

  vWave = sin(pos.x * 2.0 + uTime * 2.5) * 0.5 + 0.5;
  vPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

`;

const fragment = `
uniform float uTime;
uniform vec2 uMouse;

varying float vWave;
varying vec3 vPosition;

void main() {
  // 🧠 scale mouse ให้เข้ากับตำแหน่งจริงใน world
  vec2 scaledMouse = uMouse * 20.0;
  float distToMouse = length(vPosition.xy - scaledMouse);

  // 🔅 เพิ่มความทึบ base
  float baseAlpha = 0.06 + 0.06 * vWave; // ✅ เข้มขึ้นจากเดิม

  // 🎚 ลดความชัดเมื่อห่างเมาส์
  float falloff = clamp(1.0 - distToMouse * 0.025, 0.0, 1.0); // range กว้างขึ้นนิด
  float alpha = baseAlpha * falloff;

  // 🎨 สีฟ้าอ่อนแต่ปรับ contrast
  vec3 base = vec3(0.0, 0.85, 1.0);         // ฟ้าสว่างขึ้น
  vec3 blend = vec3(0.0, 0.15, 0.25);       // มืดน้อยลง
  vec3 color = mix(base, blend, vWave * 0.5); // ✅ blend น้อยลง = contrast สูงขึ้น

  // ✨ เพิ่ม flicker อีกนิด
  float flicker = sin(vPosition.x * 10.0 + uTime * 1.5) * cos(vPosition.y * 10.0 + uTime * 1.2);
  color += 0.03 * flicker;

  gl_FragColor = vec4(color, alpha);
}
`;

export default function CircuitLines() {
  const ref = useRef<THREE.LineSegments>(null);
  const mouse = useRef<[number, number]>([0, 0]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];

    const size = 20;
    const spacing = 1;

    for (let z = -2; z <= 2; z++) {
      for (let i = -size; i <= size; i += spacing) {
        // แนวตั้ง
        positions.push(i, -size, z, i, size, z);
        // แนวนอน
        positions.push(-size, i, z, size, i, z);
        // เฉียง /
        positions.push(-size, -size + i, z, size, size - i, z);
        // เฉียง \
        positions.push(-size, size - i, z, size, -size + i, z);
      }
    }

    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * -2 + 1;
      mouse.current = [x, y];
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial;

      // ⏱ ส่งเวลาให้ shader
      mat.uniforms.uTime.value = t;

      // 🖱 ส่งตำแหน่งเมาส์ที่ normalize แล้วให้ shader
      mat.uniforms.uMouse.value.set(mouse.current[0], mouse.current[1]);
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) }, // ✨ ตรงนี้สำคัญมาก
        }}
      />
    </lineSegments>
  );
}
