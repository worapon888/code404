import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react"; // 🔊🔇 ใช้ไอคอนจาก lucide
import clsx from "clsx";

export default function EnableSoundButton() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (enabled && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .catch((e) => console.warn("🔇 Audio play error", e));
    } else {
      audioRef.current?.pause();
    }
  }, [enabled]);

  return (
    <>
      <button
        onClick={() => setEnabled((prev) => !prev)}
        className={clsx(
          "absolute bottom-5 right-5 z-50 px-4 py-2 text-xs rounded-lg transition",
          "  text-white "
        )}
      >
        <div className="flex items-center space-x-2">
          {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <div className="flex space-x-[2px] h-4 items-end">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={clsx(
                  "w-[2px] bg-white rounded-sm",
                  enabled
                    ? `animate-wave${i}`
                    : "opacity-30 bg-white/30 animate-none"
                )}
              ></span>
            ))}
          </div>
        </div>
      </button>

      <audio ref={audioRef} src="/sounds/synth_pad80.mp3" />
    </>
  );
}
