export default function PhoneMockup({ className = "" }) {
  return (
    <div
      className={`relative rounded-[2.2rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl ${className}`}
    >
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-slate-900" />

      <div className="relative overflow-hidden rounded-[1.7rem]" style={{ aspectRatio: "9 / 18" }}>
        <svg
          viewBox="0 0 180 360"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="phSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fc1ec" />
              <stop offset="1" stopColor="#dcebf7" />
            </linearGradient>
            <linearGradient id="phRoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9aa0a7" />
              <stop offset="1" stopColor="#5d636a" />
            </linearGradient>
            <radialGradient id="phHole" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#1d2125" />
              <stop offset="0.7" stopColor="#3a3f44" />
              <stop offset="1" stopColor="#6b7178" />
            </radialGradient>
          </defs>

          <rect width="180" height="360" fill="url(#phSky)" />

          {/* door ki buildings aur ped */}
          <rect x="8" y="110" width="26" height="80" fill="#7fa6cf" />
          <rect x="38" y="90" width="22" height="100" fill="#6f98c4" />
          <rect x="118" y="100" width="24" height="90" fill="#7fa6cf" />
          <rect x="146" y="120" width="28" height="70" fill="#6f98c4" />
          <circle cx="72" cy="182" r="12" fill="#3f9a5a" />
          <circle cx="104" cy="184" r="10" fill="#4aa764" />

          {/* road */}
          <rect y="190" width="180" height="170" fill="url(#phRoad)" />
          {[200, 222, 248, 280, 318].map((y, i) => (
            <rect key={y} x={88 - i * 0.6} y={y} width={3 + i * 0.6} height={8 + i * 2} fill="#e8eaed" opacity="0.85" />
          ))}

          {/* pothole aur cracks */}
          <ellipse cx="92" cy="286" rx="44" ry="24" fill="url(#phHole)" />
          <ellipse cx="92" cy="286" rx="46" ry="26" fill="none" stroke="#a9aeb5" strokeWidth="3" />
          <path d="M50 270 L30 250 M134 272 L158 252 M60 308 L40 330 M126 310 L150 332" stroke="#4a4f55" strokeWidth="1.6" fill="none" />
        </svg>

        {/* camera controls */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-5">
          <div className="h-6 w-6 rounded-full border-2 border-white/80 bg-white/20" />
          <div className="h-12 w-12 rounded-full border-4 border-white bg-white/90" />
          <div className="h-6 w-6 rounded-full border-2 border-white/80 bg-white/20" />
        </div>
      </div>
    </div>
  );
}