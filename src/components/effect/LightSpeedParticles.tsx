import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const COUNT = 500;

export default function LightSpeedParticles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => new Float32Array(COUNT * 3), []);
  const positions = useRef<THREE.Vector3[]>([]);
  const speeds = useRef<number[]>([]);
  const { viewport, camera } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.03, 1.5, 1, 1);
    geo.rotateX(Math.PI / 2); // หันให้พุ่งตามแนว Z
    return geo;
  }, []);

  useEffect(() => {
    if (!active || !meshRef.current) return;

    const color = new THREE.Color();
    positions.current = [];
    speeds.current = [];

    for (let i = 0; i < COUNT; i++) {
      // Random สีแต่ละเส้น
      color.setHSL(Math.random(), 1, 0.6);
      colors[i * 3 + 0] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      positions.current.push(new THREE.Vector3());
      speeds.current.push(0.5 + Math.random() * 0.5);
    }

    geometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(colors, 3)
    );
  }, [active, geometry]);

  useFrame(() => {
    if (!active || !meshRef.current) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir).normalize();
    const direction = dir.negate();
    const camPos = camera.position.clone();

    const width = viewport.width;
    const height = viewport.height;

    for (let i = 0; i < COUNT; i++) {
      const pos = positions.current[i];
      const speed = speeds.current[i];

      if (pos.length() === 0) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * width * 1.5, // ✅ ครอบแนว X
          (Math.random() - 0.5) * height * 1.5, // ✅ ครอบแนว Y
          0
        );
        pos.copy(direction.clone().multiplyScalar(-20).add(offset).add(camPos));
      }

      pos.add(direction.clone().multiplyScalar(speed));

      const dist = pos.distanceTo(camPos);
      if (dist < 1.5) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * width * 1.5,
          (Math.random() - 0.5) * height * 1.5,
          0
        );
        pos.copy(direction.clone().multiplyScalar(-20).add(offset).add(camPos));
      }

      dummy.position.copy(pos);
      dummy.lookAt(pos.clone().add(dir));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, COUNT]}>
      <shaderMaterial
        key={LightSpeedShader.key}
        vertexShader={LightSpeedShader.vertex}
        fragmentShader={LightSpeedShader.fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </instancedMesh>
  );
}

const LightSpeedShader = {
  key: "LightSpeedShader",
  vertex: `
    attribute vec3 instanceColor;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vColor = instanceColor;
      vAlpha = uv.y;
      vec4 modelPosition = instanceMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `,
  fragment: `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      float fade = smoothstep(1.0, 0.2, vAlpha); // ปลายจาง
      gl_FragColor = vec4(vColor, fade * 0.7);
    }
  `,
};
