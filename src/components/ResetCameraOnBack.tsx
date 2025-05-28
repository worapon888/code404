import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";

export default function ResetCameraOnBack({ trigger }: { trigger: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!trigger) return;

    // ✅ รอ 1 tick เพื่อให้กล้องมั่นใจว่าไม่เป็น null
    const timeout = setTimeout(() => {
      if (!camera) return;

      const tl = gsap.timeline();
      console.log(camera.position.z);
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

      camera.fov = 50;
      camera.updateProjectionMatrix();
    }, 0);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return null;
}
