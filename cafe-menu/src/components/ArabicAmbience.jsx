import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ArabicAmbience({ mouseX = 0, mouseY = 0 }) {
  // subtle movement offsets based on mouse
  const offsetX = useTransform(mouseX, [0, window.innerWidth], [-10, 10]);
  const offsetY = useTransform(mouseY, [0, window.innerHeight], [-10, 10]);

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{ x: offsetX, y: offsetY }}
    >
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3e5d4] via-white to-[#f9f4ef]" />

      {/* Geometric pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
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

      {/* Flowing curves */}
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
    </motion.div>
  );
}
