import { motion } from "motion/react";

export function MandalaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-15">
      <motion.svg
        viewBox="0 0 800 800"
        className="w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] text-gold-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        {/* 8-fold Islamic Geometric Pattern Approximation */}
        <g transform="translate(400, 400)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <path d="M 0,-300 L 50,-100 L 150,-150 L 100,-50 L 300,0 L 100,50 L 150,150 L 50,100 L 0,300 Z" />
              <path d="M 0,-150 L 25,-50 L 75,-75 L 50,-25 L 150,0 L 50,25 L 75,75 L 25,50 L 0,150 Z" />
              <circle cx="0" cy="-200" r="10" />
            </g>
          ))}
          <circle cx="0" cy="0" r="100" />
          <circle cx="0" cy="0" r="200" strokeDasharray="5, 15" />
          <circle cx="0" cy="0" r="300" />
        </g>
      </motion.svg>
    </div>
  );
}
