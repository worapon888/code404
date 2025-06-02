"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ComplexLines from "../canvas/ComplexLines";
import { FloatingParticlesGroup } from "../canvas/FloatingParticlesGroup";
import FloatingBubbles from "../canvas/FloatingBubbles";
import GlitchLogo from "../GlitchLogo";
import WormholeCameraZoom from "../camera/WormholeCameraZoom";

export default function CanvasBG({ isLoaded }: { isLoaded: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <FloatingParticlesGroup layer={2} />
        <FloatingParticlesGroup layer={1} />
        <ComplexLines />
        <FloatingBubbles isLoaded={isLoaded} />
        <GlitchLogo isLoaded={isLoaded} />
        <WormholeCameraZoom isLoaded={isLoaded} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
