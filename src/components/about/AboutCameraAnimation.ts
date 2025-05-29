import gsap from "gsap";
import * as THREE from "three";

export function animateEnter({
  camera,
  gl,
  htmlRef,
  charRefs,
  setShowWarpEffect,
  setReadyToSpawn,
}: {
  camera: THREE.PerspectiveCamera;
  gl: THREE.WebGLRenderer;
  htmlRef: React.RefObject<HTMLDivElement>;
  charRefs: React.MutableRefObject<(HTMLSpanElement | null)[][]>;
  setShowWarpEffect: (v: boolean) => void;
  setReadyToSpawn: (v: boolean) => void;
}) {
  const tl = gsap.timeline();

  tl.to(camera.position, { z: 4.5, duration: 1.5, ease: "power2.out" });

  tl.to(camera.rotation, {
    y: -0.9,
    x: -0.15,
    duration: 1.6,
    ease: "sine.inOut",
  });

  const finalPos = new THREE.Vector3(2, 0.4, 0.5);

  const shakeTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
  shakeTl.to(camera.position, {
    x: "+=0.01",
    y: "-=0.01",
    z: "+=0.01",
    duration: 0.04,
  });
  shakeTl.to(camera.position, {
    x: "-=0.01",
    y: "+=0.01",
    z: "-=0.01",
    duration: 0.04,
  });

  tl.to(camera.position, {
    ...finalPos,
    duration: 2,
    ease: "power3.inOut",
    onStart: () => {
      setShowWarpEffect(true);
      setTimeout(() => setShowWarpEffect(false), 1500);
      setTimeout(() => setReadyToSpawn(true), 500);

      gsap.fromTo(
        gl.domElement,
        { filter: "blur(1.2px)" },
        { filter: "blur(0px)", duration: 0.5, delay: 0.2 }
      );

      shakeTl.play();
      setTimeout(() => {
        shakeTl.kill();
        camera.position.copy(finalPos);
      }, 500);
    },
  });

  tl.add(() => {
    gsap.to(htmlRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });

    charRefs.current.forEach((line, i) =>
      line.forEach((charEl, j) => {
        if (!charEl) return;
        gsap.fromTo(
          charEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power4.out",
            delay: i * 0.2 + j * 0.01,
          }
        );
      })
    );
  });
}

export function animateExit({
  camera,
  htmlRef,
  charRefs,
  onComplete,
}: {
  camera: THREE.PerspectiveCamera;
  htmlRef: React.RefObject<HTMLDivElement>;
  charRefs: React.MutableRefObject<(HTMLSpanElement | null)[][]>;
  onComplete: () => void;
}) {
  const tl = gsap.timeline({ onComplete });

  tl.add(() => {
    charRefs.current.forEach((line, i) =>
      line.forEach((charEl, j) => {
        if (!charEl) return;
        gsap.to(charEl, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.inOut",
          delay: i * 0.1 + j * 0.005,
        });
      })
    );
  });

  tl.to(
    htmlRef.current,
    { opacity: 0, duration: 0.4, ease: "power2.inOut" },
    ">+0.4"
  );

  tl.to(
    camera.position,
    {
      x: 0,
      y: 0,
      z: 6,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
    },
    ">+0.2"
  );

  tl.to(
    camera.rotation,
    { x: 0, y: 0, duration: 1.6, ease: "sine.inOut" },
    "<"
  );
}
