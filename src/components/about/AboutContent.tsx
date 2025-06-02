"use client";

export default function AboutContent() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-6">
      <h1
        data-text="About Me"
        className="glitch-text text-[3rem] sm:text-[4rem] font-bold text-cyan-300 mb-6 
             tracking-wider drop-shadow-[0_0_12px_rgba(0,255,255,0.6)] 
             animate-glow text-center font-mono uppercase relative"
      >
        About Me
      </h1>

      <p className="max-w-xl text-white/80 leading-relaxed text-lg">
        I’m a self-taught developer with roots in music and a mindset shaped by
        rhythm, design, and motion. I craft immersive front-end experiences that
        feel more like portals than pages — blending precision, performance, and
        emotion. From UX to animation, I build high-signal products that
        resonate, not just function. Let’s raise the bar.
      </p>
    </div>
  );
}
