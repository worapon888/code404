// src/components/GradientMaterial.tsx
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const GradientMaterial = shaderMaterial(
  {
    uColor1: new THREE.Color("#ffffff"),
    uColor2: new THREE.Color("#000000"),
    uOpacity: 0.2,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;

    void main() {
      float alpha = smoothstep(0.0, 1.0, 1.0 - vUv.y); // fade from top to bottom
      vec3 color = mix(uColor1, uColor2, vUv.y);
      gl_FragColor = vec4(color, alpha * uOpacity);
    }
  `
);

extend({ GradientMaterial });

export default GradientMaterial;
