// ✅ DistortionMaterial.tsx - Mouse-Driven Shader
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

export const DistortionShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uIntensity: 0.2,
  },
  // vertex
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     vec3 pos = position;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
   }`,
  // fragment
  `uniform vec2 uMouse;
   uniform float uIntensity;
   varying vec2 vUv;
   void main() {
     float dist = distance(vUv, uMouse);
     float alpha = smoothstep(0.3, 0.0, dist) * uIntensity;
     vec3 color = vec3(0.0, 1.0, 1.0);
     gl_FragColor = vec4(color, alpha);
   }`
);

extend({ DistortionShaderMaterial });
