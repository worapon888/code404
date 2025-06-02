"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Navigation from "./Navigation";
import ComplexLines from "./canvas/ComplexLines";
import GlitchLogo from "./GlitchLogo";
import FloatingHUD from "./about/FloatingHUD";
import BackgroundParticles from "./about/BackgroundParticles";

type Section = "home" | "about" | "services" | null;

interface CanvasBGProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function CanvasBG({
  activeSection,
  onSectionChange,
}: CanvasBGProps) {
  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          {/* Navigation */}
          <Navigation
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />

          {/* Home section */}
          {activeSection === "home" && (
            <>
              <ComplexLines />
              <GlitchLogo isLoaded={true} />
            </>
          )}

          {/* About section */}
          {activeSection === "about" && (
            <group position={[0, 0, -5]}>
              <BackgroundParticles />
              <FloatingHUD />
            </group>
          )}

          {/* Add other sections here */}
        </Suspense>
      </Canvas>
    </div>
  );
}
