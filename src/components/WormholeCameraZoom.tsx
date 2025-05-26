// WormholeCameraZoom.tsx
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";

export default function WormholeCameraZoom({
  isLoaded,
}: {
  isLoaded: boolean;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!isLoaded) return;

    // ✅ กล้องซูมเข้าอย่างนุ่มนวล
    gsap.fromTo(
      camera.position,
      { z: 20 }, // เริ่มไกลออกไป
      {
        z: 6, // ซูมเข้ามาใกล้โลโก้
        duration: 2.4,
        ease: "power4.out",
        onUpdate: () => camera.lookAt(0, 0, 0),
      }
    );
  }, [isLoaded]);

  return null;
}
