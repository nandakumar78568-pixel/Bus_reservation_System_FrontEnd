function BusMark({ className = "w-11 h-11" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GoBus logo"
    >
      <defs>
        <linearGradient id="gb-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFE9B8" />
        </linearGradient>
        <linearGradient id="gb-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD54F" />
          <stop offset="1" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient id="gb-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E3F2FD" />
          <stop offset="1" stopColor="#90CAF9" />
        </linearGradient>
      </defs>

      {/* badge */}
      <rect x="2" y="2" width="60" height="60" rx="17" fill="url(#gb-badge)" />
      <rect x="2" y="2" width="60" height="60" rx="17" fill="none" stroke="#D6262C" strokeOpacity="0.15" strokeWidth="1.5" />

      {/* ground shadow + road */}
      <ellipse cx="33" cy="50.5" rx="24" ry="2.2" fill="#000" opacity="0.15" />
      <rect x="8" y="53" width="10" height="2" rx="1" fill="#D6262C" opacity="0.35" />
      <rect x="22" y="53" width="10" height="2" rx="1" fill="#D6262C" opacity="0.35" />
      <rect x="36" y="53" width="10" height="2" rx="1" fill="#D6262C" opacity="0.35" />
      <rect x="50" y="53" width="6" height="2" rx="1" fill="#D6262C" opacity="0.35" />

      {/* roof AC unit */}
      <rect x="22" y="13.5" width="16" height="4" rx="2" fill="#D6262C" />

      {/* bus body (front is on the right) */}
      <path
        d="M10 22 Q10 17 15 17 H47 Q52 17 55 22 L58 32 V42 Q58 44 56 44 H12 Q10 44 10 42 Z"
        fill="url(#gb-body)"
      />

      {/* windshield */}
      <path d="M49 20 H51.5 Q53 20 53.8 21.8 L56 29 H49 Z" fill="url(#gb-glass)" stroke="#fff" strokeWidth="0.8" />

      {/* passenger windows */}
      {[14, 21.5, 29, 36.5].map((x) => (
        <rect key={x} x={x} y="21" width="6.5" height="8.5" rx="1.8" fill="url(#gb-glass)" stroke="#fff" strokeWidth="0.8" />
      ))}

      {/* door */}
      <rect x="43.5" y="21" width="4.5" height="20" rx="1.2" fill="#FFF3C4" stroke="#E0A100" strokeWidth="0.8" />
      <line x1="45.75" y1="21" x2="45.75" y2="41" stroke="#E0A100" strokeWidth="0.8" />

      {/* red stripe */}
      <rect x="10" y="34" width="48" height="4.2" fill="#D6262C" />
      <rect x="10" y="38.2" width="48" height="1" fill="#8C1116" opacity="0.35" />

      {/* headlight + bumper */}
      <circle cx="56" cy="32" r="1.9" fill="#FFF59D" stroke="#F9A825" strokeWidth="0.8" />
      <rect x="54.5" y="41" width="5" height="3.2" rx="1.2" fill="#6B7280" />

      {/* wheels */}
      <circle cx="21" cy="45" r="5.6" fill="#1F2937" />
      <circle cx="21" cy="45" r="2.3" fill="#CBD5E1" />
      <circle cx="46" cy="45" r="5.6" fill="#1F2937" />
      <circle cx="46" cy="45" r="2.3" fill="#CBD5E1" />
    </svg>
  );
}

function Logo({ showText = true, className = "" }) {
  return (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="drop-shadow-lg transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <BusMark />
      </span>

      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-2xl font-extrabold tracking-tight">
            Go<span className="text-yellow-300">Bus</span>
          </span>
          <span className="hidden sm:block text-[9px] font-semibold uppercase tracking-[0.28em] text-red-100/80 mt-1">
            Ride easy
          </span>
        </span>
      )}
    </span>
  );
}

export { BusMark };
export default Logo;