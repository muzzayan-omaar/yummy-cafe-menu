export default function ArabicAmbience() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-white" />

      {/* Top-right minimal lamp */}
      <svg
        className="absolute top-0 right-0 w-48 h-48 opacity-20"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 10 C55 20, 60 40, 50 70 C40 40, 45 20, 50 10 Z"
          stroke="#8B5E3C"
          strokeWidth="2"
        />
        <circle cx="50" cy="50" r="5" stroke="#8B5E3C" strokeWidth="1" />
      </svg>

      {/* Bottom-left minimal geometric motif */}
      <svg
        className="absolute bottom-0 left-0 w-48 h-48 opacity-20"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="10" width="80" height="80" stroke="#8B5E3C" strokeWidth="2" />
        <path d="M10 10 L90 90 M90 10 L10 90" stroke="#8B5E3C" strokeWidth="1" />
      </svg>
    </div>
  );
}
