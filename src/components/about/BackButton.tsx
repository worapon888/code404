"use client";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function BackButton() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        router.push("/");
      },
    });
  };

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current || !containerRef.current) return;

    const tl = gsap.timeline();

    // ✅ fade + pop-in container
    tl.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }
    );

    // ✅ เส้นที่ 1: พุ่งจากมุมซ้ายบนแบบนุ่ม
    tl.fromTo(
      line1Ref.current,
      {
        x: -40,
        y: -40,
        opacity: 0,
        rotate: 0,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.2"
    );

    // ✅ เส้นที่ 2: พุ่งจากมุมขวาล่าง
    tl.fromTo(
      line2Ref.current,
      {
        x: 40,
        y: 40,
        opacity: 0,
        rotate: 0,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.45"
    );

    // ✅ หมุนเข้าหากันเป็น X พร้อม bounce เล็กน้อย
    tl.to(
      line1Ref.current,
      { rotate: 45, duration: 0.4, ease: "back.out(2)" },
      "+=0.1"
    );
    tl.to(
      line2Ref.current,
      { rotate: -45, duration: 0.4, ease: "back.out(2)" },
      "<"
    );
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="absolute top-[18%] left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center cursor-pointer z-50"
    >
      {/* เส้นบน */}
      <div
        ref={line1Ref}
        className="absolute w-8 h-[2px] bg-white rounded origin-center shadow-[0_0_8px_rgba(0,255,255,0.5)] blur-[0.5px]"
      />
      {/* เส้นล่าง */}
      <div
        ref={line2Ref}
        className="absolute w-8 h-[2px] bg-white rounded origin-center shadow-[0_0_8px_rgba(0,255,255,0.5)] blur-[0.5px]"
      />
    </div>
  );
}
