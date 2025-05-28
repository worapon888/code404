"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CanvasBG from "./CanvasBG";
import Navigation from "./Navigation";
import LoadingScreen from "./LoadingScreen";
import EnableSoundButton from "../canvas/AmbientSound";
import ParallaxTiltEffect from "../effect/ParallaxTiltEffect";

export default function Hero() {
  // ✅ ใส่ generic เพื่อระบุชนิดให้ TypeScript
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const topNavRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [startAboutMotion, setStartAboutMotion] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [startShowcaseMotion, setStartShowcaseMotion] = useState(false);

  const handleGoToAbout = () => {
    setStartAboutMotion(true);
    setTimeout(() => setShowAbout(true), 800);
  };

  const handleGoToShowcase = () => {
    setStartShowcaseMotion(true);
    setTimeout(() => setShowShowcase(true), 800);
  };

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 300);
      }
      setLoadingProgress(progress);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 60, scale: 1.1 },
        { opacity: 1, y: 0, scale: 1, duration: 2.2, ease: "power4.out" }
      );

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.7, y: 0, duration: 1.8, ease: "power2.out" },
        ">0.2"
      );

      tl.from(
        [topNavRef.current, bottomNavRef.current, contactRef.current],
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0,
        },
        ">0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden"
    >
      <EnableSoundButton />
      <ParallaxTiltEffect>
        <CanvasBG
          isLoaded={isLoaded}
          showAbout={showAbout}
          startAboutMotion={startAboutMotion}
          setShowAbout={setShowAbout}
          showShowcase={showShowcase}
          startShowcaseMotion={startShowcaseMotion}
          setShowShowcase={setShowShowcase}
        />
      </ParallaxTiltEffect>

      {!isLoaded ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <Navigation
          onGoToAbout={handleGoToAbout}
          onGoToShowcase={handleGoToShowcase}
          topNavRef={topNavRef}
          contactRef={contactRef}
          bottomNavRef={bottomNavRef}
        />
      )}
    </section>
  );
}
