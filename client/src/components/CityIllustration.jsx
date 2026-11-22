const FRONT = [
  { x: 6, w: 34, h: 92 },
  { x: 44, w: 30, h: 128 },
  { x: 78, w: 40, h: 78 },
  { x: 122, w: 30, h: 150 },
  { x: 156, w: 36, h: 100 },
  { x: 286, w: 32, h: 116 },
  { x: 322, w: 40, h: 86 },
  { x: 366, w: 30, h: 136 },
];
const BACK = [
  { x: 24, w: 40, h: 150 },
  { x: 100, w: 38, h: 120 },
  { x: 140, w: 34, h: 170 },
  { x: 300, w: 38, h: 140 },
  { x: 345, w: 36, h: 165 },
];
const MIDDLE_BUILDINGS = [
  { x: 200, w: 34, h: 110 },
  { x: 238, w: 40, h: 140 },
];
const GROUND_Y = 200;

function Windows({ b, fill }) {
  const cols = Math.max(Math.floor((b.w - 8) / 9), 1);
  const rows = Math.max(Math.floor((b.h - 12) / 14), 1);
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      items.push(
        <rect
          key={`${r}-${c}`}
          x={b.x + 5 + c * 9}
          y={GROUND_Y - b.h + 8 + r * 14}
          width="5"
          height="7"
          rx="1"
          fill={fill}
          opacity={(r + c) % 3 === 0 ? 0.25 : 0.8}
        />
      );
    }
  }
  return <g>{items}</g>;
}

export default function CityIllustration({ variant = "city" }) {
  const front = variant === "city" ? FRONT : [...FRONT, ...MIDDLE_BUILDINGS];

  return (
    <svg viewBox="0 0 400 220" className="block w-full" aria-hidden="true">
      <defs>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f78d6" />
          <stop offset="1" stopColor="#14407f" />
        </linearGradient>
      </defs>

      {/* peeche ki buildings */}
      {BACK.map((b) => (
        <rect
          key={`back-${b.x}`}
          x={b.x}
          y={GROUND_Y - b.h}
          width={b.w}
          height={b.h}
          fill="#1b4f9c"
          opacity="0.5"
        />
      ))}

      {/* aage ki buildings aur windows */}
      {front.map((b) => (
        <g key={`front-${b.x}`}>
          <rect x={b.x} y={GROUND_Y - b.h} width={b.w} height={b.h} fill="url(#bld)" />
          <Windows b={b} fill="#9fd0ff" />
        </g>
      ))}

      {/* landmark building (sirf Login page par) */}
      {variant === "city" && (
        <g>
          <rect x="196" y="156" width="86" height="6" fill="#2f78d6" />
          <rect x="200" y="160" width="78" height="40" fill="url(#bld)" />
          <rect x="212" y="138" width="54" height="22" fill="url(#bld)" />
          <path d="M216 138 Q239 94 262 138 Z" fill="#2f78d6" />
          <rect x="237" y="78" width="4" height="24" fill="#9fd0ff" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={206 + i * 14} y="170" width="8" height="30" rx="4" fill="#0f3573" />
          ))}
        </g>
      )}

      {/* ped */}
      {[40, 200, 360].map((x) => (
        <g key={`tree-${x}`}>
          <rect x={x - 1.5} y={GROUND_Y - 10} width="3" height="10" fill="#3b2f2f" />
          <circle cx={x} cy={GROUND_Y - 16} r="9" fill="#22a35a" />
        </g>
      ))}

      {/* zameen aur road */}
      <rect x="0" y={GROUND_Y} width="400" height="20" fill="#0a2347" />
      {[10, 70, 130, 190, 250, 310, 370].map((x) => (
        <rect key={`dash-${x}`} x={x} y="209" width="30" height="2.5" rx="1" fill="#9fd0ff" opacity="0.6" />
      ))}
    </svg>
  );
}