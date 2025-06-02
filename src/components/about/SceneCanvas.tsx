"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TVOnEffect from "@/components/effect/TVOnEffect";

// ✅ Dynamic import เพื่อหลีกเลี่ยง SSR error
const HoloGridWaves = dynamic(
  () => import("@/components/circuit/HoloGridWaves"),
  { ssr: false }
);

function ResetCameraZ() {
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, 10, 10); // มุมมองจากด้านบน
    camera.lookAt(0, 0, 0);
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(window.innerWidth, window.innerHeight);
  }, []);

  return null;
}

export default function SceneCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 10, 10], fov: 45 }}
      className="!absolute !inset-0 !w-full !h-full"
    >
      <ResetCameraZ />
      <TVOnEffect />
      <HoloGridWaves />
    </Canvas>
  );
}
