"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaFacebookF, FaLinkedinIn, FaDev, FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";

type NavigationProps = {
  topNavRef: React.RefObject<HTMLDivElement | null>;
  bottomNavRef: React.RefObject<HTMLDivElement | null>;
};

const routeMap = {
  "My Services": "/services",
  AboutUs: "/about",
  Contact: "/contact",
} as const;

type RouteKey = keyof typeof routeMap;

export default function Navigation({
  topNavRef,
  bottomNavRef,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (text: RouteKey) => {
    const path = routeMap[text];
    if (path) router.push(path);
  };

  const isActive = (text: RouteKey) => {
    const path = routeMap[text];
    return pathname === path;
  };

  // ✅ ใส่ animation เมื่อ component แสดง
  useEffect(() => {
    if (topNavRef.current) {
      // ซ่อนก่อน (ทันทีเมื่อ mount)
      gsap.set(topNavRef.current, { y: -20, opacity: 0 });

      gsap.to(topNavRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power3.out",
        delay: 1.2,
      });
    }

    if (bottomNavRef.current) {
      gsap.set(bottomNavRef.current, { y: 20, opacity: 0 });

      gsap.to(bottomNavRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power3.out",
        delay: 1.2,
      });
    }
  }, []);

  return (
    <>
      <div
        ref={topNavRef}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2 text-sm font-mono"
      >
        {(Object.keys(routeMap) as RouteKey[]).map((text, index, arr) => (
          <div key={text} className="flex items-center space-x-2">
            <button
              onClick={() => handleClick(text)}
              className={`hover:text-cyan-400 transition border-b ${
                isActive(text)
                  ? "text-cyan-400 border-cyan-400"
                  : "border-transparent hover:border-cyan-400"
              }`}
            >
              {text}
            </button>

            {index < arr.length - 1 && <span>/</span>}
          </div>
        ))}
      </div>

      <div
        ref={bottomNavRef}
        className="absolute bottom-6 left-5 z-30 flex space-x-6 text-xl"
      >
        {[FaFacebookF, FaLinkedinIn, FaDev, FaXTwitter].map((Icon, i) => (
          <Link
            key={i}
            href="https://..."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition"
          >
            <Icon />
          </Link>
        ))}
        <p className="text-xs font-mono opacity-60">
          © {new Date().getFullYear()} Worapon Jintajirakul · Code404
        </p>
      </div>
    </>
  );
}
