import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaDev, FaXTwitter } from "react-icons/fa6";

type NavigationProps = {
  onGoToAbout: () => void;
  onGoToShowcase: () => void;
  onGoToServices: () => void;
  topNavRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  bottomNavRef: React.RefObject<HTMLDivElement | null>;
};

export default function Navigation({
  onGoToAbout,
  onGoToShowcase,
  onGoToServices,
  topNavRef,
  contactRef,
  bottomNavRef,
}: NavigationProps) {
  return (
    <>
      <div
        ref={topNavRef}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2 text-sm font-mono"
      >
        {["Showcase", "Services", "AboutUs"].map((text, index, arr) => (
          <div key={text} className="flex items-center space-x-2">
            <Link
              href={
                text === "AboutUs" || text === "Showcase"
                  ? "#"
                  : `/${text.toLowerCase()}`
              }
              onClick={(e) => {
                e.preventDefault();
                if (text === "Showcase") {
                  onGoToShowcase();
                } else if (text === "Services") {
                  onGoToServices();
                } else if (text === "AboutUs") {
                  onGoToAbout();
                }
              }}
              className="hover:text-cyan-400 transition border-b border-transparent hover:border-cyan-400"
            >
              {text}
            </Link>

            {index < arr.length - 1 && <span>/</span>}
          </div>
        ))}
      </div>

      <div ref={contactRef} className="absolute top-6 right-6 z-30">
        <Link
          href="#contact"
          className="px-4 py-1.5 text-sm font-mono border border-white/30 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
        >
          Contact Us
        </Link>
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
          >
            <Icon className="hover:text-cyan-400 transition" />
          </Link>
        ))}
        <p className="text-xs font-mono opacity-60">
          © {new Date().getFullYear()} Worapon Jintajirakul · Code404
        </p>
      </div>
    </>
  );
}
