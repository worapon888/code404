"use client";

type AboutTextProps = {
  charRefs: React.MutableRefObject<(HTMLSpanElement | null)[][]>;
};

const paragraphs = [
  "I’m a self-taught developer with a background in music and a mindset shaped by design, rhythm, and motion.",
  "My work sits at the intersection of aesthetic precision and technical depth — where every pixel, transition, and interaction is crafted to feel intentional.",
  "As a solo developer, I specialize in creating immersive front-end experiences. I design the UX, write the code, animate every detail, and build products that don’t just function — they resonate.",
  "I believe great interfaces should feel more like portals than pages. That’s why I work with tools like Next.js, GSAP, and WebGL, combining performance with emotion to create web experiences that leave an impression.",
  "I’m not here to make generic templates. I’m here to build distinctive, high-signal products — the kind that clients remember, users return to, and other devs wish they built.",
  "Let’s raise the bar.",
];

export default function AboutText({ charRefs }: AboutTextProps) {
  return (
    <div className="w-full text-center text-white space-y-5">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-cyan-300 drop-shadow-lg mb-6">
        About Us
      </h1>
      {paragraphs.map((text, i) => (
        <p
          key={i}
          className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed tracking-wide hover:text-white transition duration-300"
        >
          {text.split("").map((char, j) => (
            <span
              key={j}
              ref={(el) => {
                if (!charRefs.current[i]) charRefs.current[i] = [];
                charRefs.current[i][j] = el;
              }}
              style={{ display: "inline-block", opacity: 0 }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
