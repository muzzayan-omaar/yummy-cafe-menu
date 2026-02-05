import { motion } from "framer-motion";

export default function ArabicAmbience() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      
      {/* Coffee-tone gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1b12] via-[#3a2417] to-[#1e120b] opacity-10 dark:opacity-20" />

      {/* Geometric pattern – slow drift */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        initial={{ x: 0, y: 0 }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ opacity: 0.035 }}
      >
        <defs>
          <pattern id="arabicPattern" width="80" height="80" patternUnits="userSpaceOnUse">
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
      </motion.svg>

      {/* Flowing Arabic curves */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        initial={{ opacity: 0.02 }}
        animate={{ opacity: [0.02, 0.045, 0.02] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0 200 C 200 100, 400 300, 600 180 S 900 120, 1200 200"
          fill="none"
          stroke="#A66A3F"
          strokeWidth="2"
        />
      </motion.svg>
    </div>
  );
}
