'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 56, text: 'text-4xl' },
  };
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Shanyrak-inspired icon — stylized circular ornament representing unity/togetherness */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
        {/* Inner shanyrak cross pattern */}
        <line x1="32" y1="10" x2="32" y2="54" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <line x1="10" y1="32" x2="54" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        {/* Diagonal beams */}
        <line x1="16" y1="16" x2="48" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
        <line x1="48" y1="16" x2="16" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
        {/* Center circle — the tunduk (heart of shanyrak) */}
        <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2.5" />
        {/* Inner ring accent */}
        <circle cx="32" cy="32" r="4" fill="var(--color-accent, #EDE9FE)" />
        {/* Decorative arcs — Kazakh ornamental curves */}
        <path d="M 20 12 Q 32 20 44 12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 20 52 Q 32 44 44 52" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 12 20 Q 20 32 12 44" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 52 20 Q 44 32 52 44" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
      {showText && (
        <span className={`${s.text} font-light tracking-wide text-text-primary`}>
          <span className="font-medium">Birge</span>Bolis
        </span>
      )}
    </span>
  );
}
