// ArabicAmbience.jsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function ArabicAmbience() {
  const [winSize, setWinSize] = useState({ width: 0, height: 0 });

  // Track window size safely
  useEffect(() => {
    const handleResize = () =>
      setWinSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse position
  const mouseX = useMotionValue(winSize.width / 2);
  const mouseY = useMotionValue(winSize.height / 2);

  useEffect(() => {
    const handleMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // Transform for subtle parallax
  const offsetX = useTransform(mouseX, [0, winSize.width || 1], [-10, 10]);
  const offsetY = useTransform(mouseY, [0, winSize.height || 1], [-10, 10]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Soft coffee gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200" />

      {/* Floating geometric pattern */}
      <motion.svg
        className="absolute w-full h-full opacity-10"
        style={{ x: offsetX, y: offsetY }}
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
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arabicPattern)" />
      </motion.svg>

      {/* Flowing subtle curves */}
      <motion.svg
        className="absolute w-full h-full opacity-15"
        style={{ x: offsetX, y: offsetY }}
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
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
