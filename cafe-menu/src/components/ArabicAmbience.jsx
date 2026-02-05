export default function ArabicAmbience() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100" />

      {/* Islamic geometric pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="arabicPattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z"
              fill="none"
              stroke="#8B5E3C"
              strokeWidth="1"
            />
            <circle
              cx="40"
              cy="40"
              r="28"
              fill="none"
              stroke="#8B5E3C"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#arabicPattern)" />
      </svg>

      {/* Flowing arabic curves */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0 200 C 200 100, 400 300, 600 180 S 900 120, 1200 200"
          fill="none"
          stroke="#A66A3F"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
