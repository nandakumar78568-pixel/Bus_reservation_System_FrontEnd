function BusBanner({ busType }) {
  const themes = {
    AC: { body: "#2563eb", accent: "#93c5fd", roof: "#1e40af" },
    Non_AC: { body: "#ea580c", accent: "#fed7aa", roof: "#9a3412" },
    Sleeper: { body: "#7c3aed", accent: "#ddd6fe", roof: "#5b21b6" },
    Semi_Sleeper: { body: "#059669", accent: "#a7f3d0", roof: "#065f46" },
  };
  const theme = themes[busType] || themes.AC;

  return (
    <div className="h-28 rounded-t-lg overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50 relative">
      <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
        {/* road */}
        <rect x="0" y="120" width="400" height="20" fill="#cbd5e1" />
        <rect x="0" y="126" width="400" height="4" fill="#94a3b8" />

        {/* bus body */}
        <rect x="40" y="45" width="300" height="65" rx="10" fill={theme.body} />
        <rect x="40" y="45" width="300" height="20" rx="10" fill={theme.roof} />

        {/* windshield */}
        <rect x="300" y="55" width="30" height="30" rx="4" fill="#e0f2fe" opacity="0.9" />

        {/* passenger windows */}
        {[70, 110, 150, 190, 230, 270].map((x, i) => (
          <rect key={i} x={x} y="55" width="30" height="22" rx="3" fill={theme.accent} />
        ))}

        {/* door */}
        <rect x="55" y="75" width="15" height="35" rx="2" fill={theme.roof} opacity="0.6" />

        {/* wheels */}
        <circle cx="100" cy="112" r="14" fill="#1f2937" />
        <circle cx="100" cy="112" r="6" fill="#9ca3af" />
        <circle cx="280" cy="112" r="14" fill="#1f2937" />
        <circle cx="280" cy="112" r="6" fill="#9ca3af" />

        {/* headlight */}
        <rect x="335" y="90" width="6" height="10" rx="2" fill="#fde68a" />

        {/* bumper */}
        <rect x="38" y="105" width="304" height="6" rx="3" fill={theme.roof} opacity="0.5" />
      </svg>
    </div>
  );
}

export default BusBanner;