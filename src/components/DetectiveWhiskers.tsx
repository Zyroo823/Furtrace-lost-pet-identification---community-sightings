import React from 'react';
import { Sparkles, Scan, Search, ShieldCheck } from 'lucide-react';

interface DetectiveWhiskersProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  mood?: 'detecting' | 'alert' | 'happy' | 'neutral';
  showSpeech?: boolean;
  speechText?: string;
  className?: string;
  onClick?: () => void;
}

export const DetectiveWhiskers: React.FC<DetectiveWhiskersProps> = ({
  size = 'md',
  mood = 'detecting',
  showSpeech = false,
  speechText = "I'm analyzing pet patterns & sightings with AI vision!",
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    hero: 'w-36 h-36 md:w-44 md:h-44'
  };

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`} onClick={onClick}>
      <div className={`relative ${sizeMap[size]} transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Glow Behind */}
          <circle cx="100" cy="105" r="75" fill="#E06D53" fillOpacity="0.12" />

          {/* Ears */}
          {/* Left Ear */}
          <path
            d="M 52 75 L 28 24 C 28 24 58 32 72 58 Z"
            fill="#E06D53"
            stroke="#1E293B"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M 48 65 L 34 32 C 34 32 52 38 62 55 Z"
            fill="#F4A28C"
            opacity="0.85"
          />

          {/* Right Ear */}
          <path
            d="M 148 75 L 172 24 C 172 24 142 32 128 58 Z"
            fill="#E06D53"
            stroke="#1E293B"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M 152 65 L 166 32 C 166 32 148 38 138 55 Z"
            fill="#F4A28C"
            opacity="0.85"
          />

          {/* Head Base */}
          <path
            d="M 42 110 C 42 60 158 60 158 110 C 158 152 135 168 100 168 C 65 168 42 152 42 110 Z"
            fill="#FDFBF7"
            stroke="#1E293B"
            strokeWidth="5"
          />

          {/* Head Marking / Tabby Crown V-blaze */}
          <path
            d="M 94 65 L 100 82 L 106 65"
            stroke="#E06D53"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 85 68 L 90 80"
            stroke="#E06D53"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 115 68 L 110 80"
            stroke="#E06D53"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Detective Tweed Cap / Visor */}
          <path
            d="M 48 72 C 60 48 140 48 152 72 C 156 80 144 86 100 86 C 56 86 44 80 48 72 Z"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="4"
          />
          {/* Visor Brim Accent */}
          <path
            d="M 40 78 C 65 88 135 88 160 78 C 165 83 148 94 100 94 C 52 94 35 83 40 78 Z"
            fill="#1E293B"
          />
          <path
            d="M 46 80 C 72 88 128 88 154 80"
            stroke="#7DA18B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Left Eye (Normal / Friendly Winking or Open) */}
          <ellipse cx="76" cy="115" rx="9" ry="11" fill="#1E293B" />
          <ellipse cx="73" cy="111" rx="3.5" ry="4" fill="#FDFBF7" />
          <ellipse cx="79" cy="118" rx="1.5" ry="1.5" fill="#7DA18B" />

          {/* Right Eye: High-Tech Detective Monocle / Magnifying Paw Lens */}
          {/* Monocle Frame & Lens */}
          <circle
            cx="124"
            cy="114"
            r="19"
            fill="#7DA18B"
            fillOpacity="0.22"
            stroke="#E06D53"
            strokeWidth="4"
          />
          <circle
            cx="124"
            cy="114"
            r="16"
            stroke="#7DA18B"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Monocle Eye */}
          <ellipse cx="124" cy="114" rx="9" ry="11" fill="#1E293B" />
          <ellipse cx="121" cy="110" rx="3.5" ry="4" fill="#FDFBF7" />
          {/* Embedded Paw Print Inside Monocle Lens Reflection */}
          <g fill="#E06D53" opacity="0.9">
            <circle cx="124" cy="120" r="3.2" />
            <circle cx="120" cy="113" r="1.6" />
            <circle cx="123" cy="110" r="1.6" />
            <circle cx="126" cy="110" r="1.6" />
            <circle cx="129" cy="113" r="1.6" />
          </g>
          {/* Monocle Cord / Ribbon */}
          <path
            d="M 143 114 C 158 120 162 145 156 160"
            stroke="#E06D53"
            strokeWidth="2.5"
            strokeDasharray="3 2"
            fill="none"
          />

          {/* Cute Pink/Terracotta Nose */}
          <polygon
            points="95,127 105,127 100,134"
            fill="#E06D53"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Cat Mouth */}
          <path
            d="M 94 134 C 94 140 100 142 100 134 C 100 142 106 140 106 134"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks Blush */}
          <ellipse cx="60" cy="128" rx="7" ry="4" fill="#F4A28C" opacity="0.6" />
          <ellipse cx="140" cy="128" rx="7" ry="4" fill="#F4A28C" opacity="0.6" />

          {/* Whiskers (Sharp, technical sensor look) */}
          <path d="M 52 126 L 22 122" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50 132 L 18 134" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 52 138 L 24 144" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

          <path d="M 148 126 L 178 122" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 150 132 L 182 134" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 148 138 L 176 144" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

          {/* Detective Badge Collar */}
          <path
            d="M 75 162 C 90 172 110 172 125 162"
            stroke="#7DA18B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Gold Paw Locket / Shield */}
          <path
            d="M 100 166 L 108 174 L 100 186 L 92 174 Z"
            fill="#E06D53"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <circle cx="100" cy="176" r="2.5" fill="#FDFBF7" />
        </svg>

        {/* Floating Scan Indicator */}
        <div className="absolute -top-1 -right-1 bg-[#E06D53] text-white p-1 rounded-full shadow-md animate-pulse">
          <Scan className="w-3.5 h-3.5" />
        </div>
      </div>

      {showSpeech && (
        <div className="relative bg-white border border-[#E06D53]/20 shadow-lg rounded-2xl p-3.5 max-w-xs text-xs text-[#1E293B] leading-relaxed">
          {/* Arrow */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white" />
          <div className="flex items-center gap-1.5 font-bold text-[#E06D53] mb-1 font-display tracking-tight text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Detective Whiskers says:</span>
          </div>
          <p className="text-slate-600">{speechText}</p>
        </div>
      )}
    </div>
  );
};
