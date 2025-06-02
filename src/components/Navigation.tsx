"use client";
import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";

type Section = "home" | "about" | "services" | "contact" | null;

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClick = (section: Section) => {
    if (!section) return;

    const pathMap: Record<Section, string> = {
      home: "/",
      about: "/about",
      services: "/services",
      contact: "/contact",
      null: "/",
    };

    const path = pathMap[section];
    if (path) {
      router.push(path);
    }
  };

  return (
    <Html
      transform
      position={[0, 0, 0]}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 pointer-events-auto"
      >
        <div className="flex items-center space-x-8">
          {(["home", "about", "services", "contact"] as Section[]).map(
            (section) => (
              <button
                key={section}
                onClick={() => handleClick(section)}
                className={`text-sm font-mono capitalize transition-colors ${
                  activeSection === section
                    ? "text-[#00ffff]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {section}
              </button>
            )
          )}
        </div>
      </nav>
    </Html>
  );
}
