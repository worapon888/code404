"use client";

import { useEffect, useRef, useState } from "react";

import CanvasBG from "./CanvasBG";
import Navigation from "./Navigation";
import LoadingScreen from "./LoadingScreen";
import EnableSoundButton from "../canvas/AmbientSound";
import ParallaxTiltEffect from "../effect/ParallaxTiltEffect";
import { useLoading } from "@/context/LoadingContext";

export default function Hero() {
  const { isLoaded, setIsLoaded } = useLoading();

  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(isLoaded); // ✅ ใช้ isLoaded เป็น default
  const progressRef = useRef(0);
  const hasStartedRef = useRef(false);

  const topNavRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  // ✅ ไล่ progress ทีละเฟรม
  useEffect(() => {
    if (isLoaded) {
      setProgress(100); // ถ้าโหลดแล้ว เคาะ progress = 100
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const animateProgress = () => {
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        setProgress(100);
        return;
      }

      progressRef.current += Math.random() * 4 + 1;
      setProgress(Math.floor(progressRef.current));
      requestAnimationFrame(animateProgress);
    };

    requestAnimationFrame(animateProgress);
  }, [isLoaded]);

  // ✅ แสดง Loading เฉพาะตอนยังไม่เคยโหลด
  const shouldShowLoading = !isLoaded && !showContent;

  return (
    <section className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <EnableSoundButton />
      <ParallaxTiltEffect>
        <CanvasBG isLoaded={showContent} />
      </ParallaxTiltEffect>

      {shouldShowLoading ? (
        <LoadingScreen
          progress={progress}
          onComplete={() => {
            setIsLoaded(true);
            setShowContent(true);
          }}
        />
      ) : (
        <Navigation topNavRef={topNavRef} bottomNavRef={bottomNavRef} />
      )}
    </section>
  );
}
