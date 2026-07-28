const busTypeConfig = {
  AC: {
    gradient: "from-sky-500 to-blue-600",
    stripe: "#1d4ed8",
    windowColor: "#bae6fd",
    badge: "❄️",
    label: "AC",
  },
  Non_AC: {
    gradient: "from-amber-500 to-orange-600",
    stripe: "#c2410c",
    windowColor: "#fed7aa",
    badge: "🌬️",
    label: "Non-AC",
  },
  Sleeper: {
    gradient: "from-purple-500 to-indigo-600",
    stripe: "#4338ca",
    windowColor: "#ddd6fe",
    badge: "🌙",
    label: "Sleeper",
  },
  Semi_Sleeper: {
    gradient: "from-teal-500 to-emerald-600",
    stripe: "#047857",
    windowColor: "#a7f3d0",
    badge: "🛋️",
    label: "Semi-Sleeper",
  },
};

function BusBanner({ busType, className = "h-32" }) {
  const config = busTypeConfig[busType] || busTypeConfig.AC;

  return (
    <div
      className={`relative ${className} rounded-t-lg bg-gradient-to-r ${config.gradient} overflow-hidden flex items-end justify-center`}
    >
      {/* road line for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/10" />

      <svg
        viewBox="0 0 400 150"
        className="w-4/5 max-w-xs drop-shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ground shadow */}
        <ellipse cx="200" cy="136" rx="155" ry="7" fill="rgba(0,0,0,0.18)" />

        {/* roof (slightly wider, rounded) */}
        <path
          d="M28 48 Q28 24 54 24 H346 Q372 24 372 48 V52 H28 Z"
          fill="#ffffff"
        />

        {/* main body */}
        <rect x="28" y="38" width="344" height="76" rx="14" fill="#ffffff" />

        {/* lower stripe (color-coded by bus type) */}
        <rect x="28" y="96" width="344" height="14" fill={config.stripe} />

        {/* front windshield (front = right side) */}
        <path
          d="M328 40 H353 Q364 40 364 51 V72 H328 Z"
          fill={config.windowColor}
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* passenger windows */}
        {[52, 92, 132, 172, 212, 252].map((x) => (
          <rect
            key={x}
            x={x}
            y="44"
            width="30"
            height="28"
            rx="4"
            fill={config.windowColor}
            stroke="#e2e8f0"
            strokeWidth="2"
          />
        ))}

        {/* door */}
        <rect
          x="296"
          y="72"
          width="24"
          height="38"
          rx="3"
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        <line x1="308" y1="72" x2="308" y2="110" stroke="#cbd5e1" strokeWidth="2" />

        {/* headlight */}
        <circle cx="365" cy="82" r="6" fill="#fde68a" stroke="#fbbf24" strokeWidth="1" />

        {/* front bumper */}
        <rect x="360" y="98" width="12" height="16" rx="3" fill="#94a3b8" />

        {/* side mirror */}
        <rect x="362" y="52" width="8" height="4" rx="2" fill="#475569" />

        {/* wheels */}
        <circle cx="98" cy="116" r="18" fill="#1e293b" />
        <circle cx="98" cy="116" r="7" fill="#cbd5e1" />
        <circle cx="298" cy="116" r="18" fill="#1e293b" />
        <circle cx="298" cy="116" r="7" fill="#cbd5e1" />
      </svg>

      {/* type badge */}
      <div className="absolute top-2 right-2 bg-white/95 rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-semibold shadow">
        <span>{config.badge}</span>
        <span className="text-gray-700">{config.label}</span>
      </div>
    </div>
  );
}

export default BusBanner;