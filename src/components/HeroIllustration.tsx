import React, { useState } from 'react';

interface HeroIllustrationProps {
  className?: string;
}

export const HeroIllustration: React.FC<HeroIllustrationProps> = ({ className = '' }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glows: Soft Lavender & Peach radial aura */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-violet-200/40 via-purple-100/30 to-[#FFE4DC]/50 rounded-full blur-2xl pointer-events-none -z-10" />

      {!imgError ? (
        <img
          src="/hero-illustration.svg"
          alt="Prom_Maru AI Writing Assistant"
          className="w-full h-auto max-w-[480px] drop-shadow-[0_16px_36px_rgba(124,58,237,0.08)] animate-float-slow transition-transform hover:scale-[1.02] duration-300"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback directly renders the clean asset */
        <svg
          viewBox="0 0 600 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-w-[480px] drop-shadow-[0_16px_36px_rgba(124,58,237,0.08)] animate-float-slow"
        >
          <defs>
            <linearGradient id="fallbackWandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>
            <linearGradient id="fallbackCoralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FECDD3" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <filter id="fallbackShadow" x="-20%" y="-20%" width="145%" height="145%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#7C3AED" floodOpacity="0.1" />
            </filter>
          </defs>
          <ellipse cx="300" cy="430" rx="220" ry="26" fill="#F2EAE1" fillOpacity="0.75" />
          <g transform="translate(90, 85)" filter="url(#fallbackShadow)">
            <rect x="0" y="0" width="280" height="210" rx="24" fill="#FFFFFF" stroke="#E9D5FF" strokeWidth="2" />
            <g transform="translate(24, 24)">
              <rect x="0" y="0" width="40" height="40" rx="12" fill="#7C3AED" />
              <path d="M 20 10 L 22.5 17 L 29 20 L 22.5 23 L 20 30 L 17.5 23 L 11 20 L 17.5 17 Z" fill="#FFFFFF" />
              <rect x="52" y="8" width="120" height="10" rx="5" fill="#DDD6FE" />
              <rect x="52" y="24" width="85" height="7" rx="3.5" fill="#F3E8FF" />
            </g>
            <g transform="translate(24, 85)">
              <rect x="0" y="0" width="230" height="9" rx="4.5" fill="#1F2937" fillOpacity="0.8" />
              <rect x="0" y="18" width="210" height="8" rx="4" fill="#4B5563" fillOpacity="0.7" />
              <rect x="0" y="34" width="220" height="8" rx="4" fill="#6B7280" fillOpacity="0.6" />
            </g>
            <g transform="translate(24, 160)">
              <rect x="0" y="0" width="54" height="20" rx="10" fill="#F5F3FF" stroke="#DDD6FE" strokeWidth="1" />
              <rect x="10" y="7" width="34" height="6" rx="3" fill="#7C3AED" />
              <rect x="160" y="0" width="60" height="20" rx="10" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="1" />
              <circle cx="170" cy="10" r="3" fill="#FB7185" />
              <rect x="178" y="7" width="34" height="6" rx="3" fill="#FB7185" />
            </g>
          </g>
          <g transform="translate(300, 180) rotate(-26)">
            <rect x="40" y="10" width="170" height="18" rx="9" fill="url(#fallbackWandGrad)" />
            <circle cx="20" cy="19" r="8" fill="#FFFFFF" />
          </g>
          <g transform="translate(300, 140)">
            <path d="M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z" fill="url(#fallbackCoralGrad)" />
          </g>
        </svg>
      )}
    </div>
  );
};
