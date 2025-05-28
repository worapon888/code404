export default function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center text-white space-y-4">
      <p className="text-sm font-mono tracking-wide">
        Loading {Math.floor(progress)}%
      </p>
      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
