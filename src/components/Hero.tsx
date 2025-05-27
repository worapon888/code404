"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import ComplexLines from "./ComplexLines";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { FloatingParticlesGroup } from "./FloatingParticlesGroup";
import { ParallaxTiltEffect } from "./ParallaxTiltEffect";
import EnableSoundButton from "./AmbientSound";
import "./GlitchMaterial";
import GlitchLogo from "./GlitchLogo";
import WormholeCameraZoom from "./WormholeCameraZoom";
import FloatingBubbles from "./FloatingBubbles";
import { FaFacebookF, FaLinkedinIn, FaDev, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import AboutSectionInsideCanvas from "./AboutSectionInsideCanvas";

import LightSpeedParticles from "./LightSpeedParticles";

function CanvasBG({
  isLoaded,
  showAbout,
  startAboutMotion,
}: {
  isLoaded: boolean;
  showAbout: boolean;
  startAboutMotion: boolean;
}) {
  const [showWarpEffect, setShowWarpEffect] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1 }}
      gl={{ antialias: true }}
      className="absolute inset-0 z-0"
    >
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <FloatingParticlesGroup layer={2} />
        <FloatingParticlesGroup layer={1} />
        <ComplexLines />
        <FloatingBubbles isLoaded={isLoaded} />
        {startAboutMotion && <AboutSectionInsideCanvas show={showAbout} setShowWarpEffect={setShowWarpEffect}/>}
        {showWarpEffect && <LightSpeedParticles active />}
        {startAboutMotion && (
          <AboutSectionInsideCanvas
            show={showAbout}
            setShowWarpEffect={setShowWarpEffect}
          />
        )}
        <GlitchLogo isLoaded={isLoaded} />
        <WormholeCameraZoom isLoaded={isLoaded} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const subRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const topNavRef = useRef(null);
  const bottomNavRef = useRef(null);
  const contactRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);
  const [startAboutMotion, setStartAboutMotion] = useState(false);

  const handleGoToAbout = () => {
    setStartAboutMotion(true);
    setTimeout(() => setShowAbout(true), 800); // กล้องซูมก่อน แล้วค่อยโชว์ข้อความ
  };
  // simulate loading 0-100%
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 2; // เพิ่มแบบสุ่ม
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 300); // delay ก่อนแสดงโลโก้
      }
      setLoadingProgress(progress);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // animate in logo after loaded
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 🔵 Logo
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 60, scale: 1.1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2.2,
          ease: "power4.out",
        }
      );

      // 🔵 Tagline
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 0.7,
          y: 0,
          duration: 1.8,
          ease: "power2.out",
        },
        ">0.2"
      );

      // 🟣 Top + Bottom nav แสดงพร้อมกันหลัง tagline
      tl.from(
        [topNavRef.current, bottomNavRef.current, contactRef.current],
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0, // 🔁 ไม่มี delay ระหว่างสองตัวนี้
        },
        ">0.3" // ⏳ เริ่มหลัง tagline 0.3s
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
        />
      </ParallaxTiltEffect>

      {/* 🔵 Loading screen */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center text-white space-y-4">
          <p className="text-sm font-mono tracking-wide">
            Loading {Math.floor(loadingProgress)}%
          </p>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}
      {isLoaded && (
        <>
          <div
            ref={topNavRef}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2 text-sm font-mono text-white"
          >
            <Link
              href="showcase"
              className="hover:text-cyan-400 transition border-b border-transparent hover:border-cyan-400"
            >
              Showcase
            </Link>
            <p>/</p>
            <Link
              href="services"
              className="hover:text-cyan-400 transition border-b border-transparent hover:border-cyan-400"
            >
              Services
            </Link>
            <p>/</p>
            <Link
              href="about"
              onClick={(e) => {
                e.preventDefault();
                handleGoToAbout();
              }}
              className="text-sm font-mono hover:text-cyan-300 transition"
            >
              AboutUs
            </Link>
          </div>
          <div ref={contactRef} className="absolute top-6 right-6 z-30">
            <Link
              href="#contact"
              className="px-4 py-1.5 text-sm font-mono border border-white/30 rounded-lg text-white hover:bg-white/10 transition backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>

          <div
            ref={bottomNavRef}
            className="absolute bottom-6 left-5 z-30 flex space-x-6 text-white text-xl"
          >
            <Link
              href="https://facebook.com/..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="hover:text-blue-400 transition" />
            </Link>
            <Link
              href="https://linkedin.com/..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="hover:text-blue-400 transition" />
            </Link>
            <Link
              href="https://dev.to/..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDev className="hover:text-gray-300 transition" />
            </Link>
            <Link
              href="https://x.com/..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter className="hover:text-white transition" />
            </Link>

            <div className="flex items-center justify-center">
              <p className="text-white text-center text-xs font-mono opacity-60">
                © {new Date().getFullYear()} Worapon Jintajirakul · Code404
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
