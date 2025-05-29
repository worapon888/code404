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
import ShowcaseSectionInsideCanvas from "../showcase/ShowcaseSectionInsideCanvas";

export default function CanvasBG({
  isLoaded,
  activeSection,
  setActiveSection,
}: {
  isLoaded: boolean;
  activeSection: "home" | "about" | "showcase" | "services" | null;
  setActiveSection: (
    v: "home" | "about" | "showcase" | "services" | null
  ) => void;
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
        {activeSection === "about" && (
          <AboutSectionInsideCanvas
            show={activeSection === "about"}
            onClose={() => setActiveSection(null)}
            setShowWarpEffect={setShowWarpEffect}
          />
        )}

        {/* ✅ Showcase Section */}
        {activeSection === "showcase" && (
          <ShowcaseSectionInsideCanvas
            show={activeSection === "showcase"}
            onClose={() => setActiveSection(null)}
            setShowWarpEffect={setShowWarpEffect}
          />
        )}
        {showWarpEffect && <LightSpeedParticles active />}

        <GlitchLogo isLoaded={isLoaded} />
        <WormholeCameraZoom isLoaded={isLoaded} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
