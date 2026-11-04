import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const SudaneseEmblem: React.FC<EmblemProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="شعار شعراء السودان"
    >
      {/* Outer Nubian diamond border */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        stroke="#D9B56D"
        strokeWidth="3"
        fill="#183C35"
        className="transition-colors duration-300"
      />
      
      {/* Inner concentric geometric motif */}
      <polygon
        points="50,14 86,50 50,86 14,50"
        stroke="#D9B56D"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        fill="none"
      />

      {/* Stylized Traditional Arabic Reed Pen (Qalam) & Nile Waves */}
      <path
        d="M50 20 L56 36 L50 80 L44 36 Z"
        fill="#D9B56D"
      />
      <path
        d="M50 20 L50 82"
        stroke="#183C35"
        strokeWidth="1.5"
      />

      {/* Nile wave curve at the base of the pen */}
      <path
        d="M32 64 Q50 54 68 64 Q50 74 32 64 Z"
        fill="#D9B56D"
        opacity="0.9"
      />

      {/* Small Nubian geometric corner triangles */}
      <polygon points="50,22 46,28 54,28" fill="#D9B56D" />
      <polygon points="50,78 46,72 54,72" fill="#D9B56D" />
      <polygon points="22,50 28,46 28,54" fill="#D9B56D" />
      <polygon points="78,50 72,46 72,54" fill="#D9B56D" />
    </svg>
  );
};

export const NubianDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 opacity-85 select-none ${className}`}>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#D9B56D] to-[#D9B56D]" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D9B56D]">
        <polygon points="12,2 22,12 12,22 2,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="12,6 18,12 12,18 6,12" fill="currentColor" opacity="0.4" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#D9B56D] to-[#D9B56D]" />
    </div>
  );
};
