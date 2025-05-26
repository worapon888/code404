import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

// ✅ สร้าง Shader Material
const GlitchMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1,
    uTexture: new THREE.Texture(),
  },
  // ✅ Vertex Shader
  `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // ✅ Fragment Shader
  `
    varying vec2 vUv;

    uniform float uTime;
    uniform float uIntensity;
    uniform sampler2D uTexture;

    float random(float x) {
      return fract(sin(x) * 43758.5453);
    }

    float random2(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;

      float segment = floor(uv.y * 20.0);
      float glitchTrigger = step(0.9, fract(sin(uTime * 2.0) * 100.0));
      float glitchActive = glitchTrigger * uIntensity;

      float rand = random(segment + floor(uTime * 3.0));
      vec2 offset = vec2(0.0);

      if (rand > 0.5) {
        float strength = (rand - 0.5) * 0.2 * glitchActive;
        offset = vec2(0.0, strength);
      }

      float r = texture2D(uTexture, uv + offset * 1.5).r;
      float g = texture2D(uTexture, uv - offset * 1.0).g;
      float b = texture2D(uTexture, uv).b;

      vec3 color = vec3(r, g, b);

      if (rand < 0.15 && glitchActive > 0.0) {
        color *= 0.0;
      }

      float flash = step(0.995, random2(vec2(uTime * 4.0, uv.y))) * 0.4;
      color += flash;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// ✅ ให้ R3F รู้จัก <glitchMaterial />
extend({ GlitchMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    glitchMaterial: unknown;
  }
}

export default GlitchMaterial;
