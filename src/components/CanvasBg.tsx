"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import WormholeCameraZoom from "./WormholeCameraZoom";
import GlitchLogo from "./GlitchLogo";
import ComplexLines from "./ComplexLines";
import FloatingBubbles from "./FloatingBubbles";
import { FloatingParticlesGroup } from "./FloatingParticlesGroup";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function CanvasBG() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1 }}
      gl={{ antialias: true }}
      className="fixed inset-0 z-0"
    >
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <FloatingParticlesGroup layer={2} />
        <FloatingParticlesGroup layer={1} />
        <ComplexLines />
        <FloatingBubbles isLoaded={true} />
        <GlitchLogo isLoaded={true} />
        <WormholeCameraZoom isLoaded={true} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
