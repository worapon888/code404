"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ComplexLines from "../canvas/ComplexLines";
import { FloatingParticlesGroup } from "../canvas/FloatingParticlesGroup";
import FloatingBubbles from "../canvas/FloatingBubbles";
import GlitchLogo from "../GlitchLogo";
import WormholeCameraZoom from "../camera/WormholeCameraZoom";
import LightSpeedParticles from "../effect/LightSpeedParticles";
import AboutSectionInsideCanvas from "../about/AboutSectionInsideCanvas";
import ResetCameraOnBack from "../camera/ResetCameraOnBack";
import ShowcaseSectionInsideCanvas from "../showcase/ShowcaseSectionInsideCanvas";

export default function CanvasBG({
  isLoaded,
  showAbout,
  startAboutMotion,
  setShowAbout,
  showShowcase,
  startShowcaseMotion,
  setShowShowcase,
}: {
  isLoaded: boolean;
  showAbout: boolean;
  startAboutMotion: boolean;
  setShowAbout: (v: boolean) => void;
  showShowcase: boolean;
  startShowcaseMotion: boolean;
  setShowShowcase: (v: boolean) => void;
}) {
  const [showWarpEffect, setShowWarpEffect] = useState(false);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <FloatingParticlesGroup layer={2} />
        <FloatingParticlesGroup layer={1} />
        <ComplexLines />
        <FloatingBubbles isLoaded={isLoaded} />
        {/* ✅ About Section */}
        {startAboutMotion && (
          <AboutSectionInsideCanvas
            show={showAbout}
            onClose={() => setShowAbout(false)}
            setShowWarpEffect={setShowWarpEffect}
          />
        )}

        {/* ✅ Showcase Section */}
        {startShowcaseMotion && (
          <ShowcaseSectionInsideCanvas
            show={showShowcase}
            onClose={() => setShowShowcase(false)}
            setShowWarpEffect={setShowWarpEffect}
          />
        )}
        {showWarpEffect && <LightSpeedParticles active />}
        {!showAbout && <ResetCameraOnBack trigger={!showAbout} />}
        <GlitchLogo isLoaded={isLoaded} />
        <WormholeCameraZoom isLoaded={isLoaded} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
