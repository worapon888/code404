import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";
import { PerspectiveCamera } from "three";

export default function ResetCameraOnBack({ trigger }: { trigger: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!trigger) return;

    const timeout = setTimeout(() => {
      if (!camera) return;

      const tl = gsap.timeline();

      tl.to(camera.position, {
        x: 0,
        y: 0,
        z: 6,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: () => camera.updateProjectionMatrix(),
      });

      tl.to(
        camera.rotation,
        {
          x: 0,
          y: 0,
          duration: 1.6,
          ease: "sine.inOut",
        },
        "<"
      );

      // ✅ cast ให้เป็น PerspectiveCamera ก่อนใช้ .fov
      const perspectiveCamera = camera as PerspectiveCamera;
      perspectiveCamera.fov = 50;
      perspectiveCamera.updateProjectionMatrix();
    }, 0);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return null;
}
