import React, { ReactNode } from 'react';

interface GameCardProps {
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

export function GameCard({
  children,
  className = '',
  gradientFrom,
  gradientTo,
  glowColor,
}: GameCardProps) {
  const customStyle: React.CSSProperties = {
    clipPath:
      'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
  };

  // Use black semi-transparent background with frosted glass effect
  customStyle.background = 'rgba(0, 0, 0, 0.3)';
  customStyle.backdropFilter = 'blur(10px)';
  customStyle.border = '2px solid rgba(59, 130, 246, 0.6)';

  const glowStyle: React.CSSProperties = {
    boxShadow: glowColor
      ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 32px 4px rgba(59, 130, 246, 0.3)`
      : '0 0 32px 4px rgba(59, 130, 246, 0.3)',
    zIndex: 1,
    clipPath:
      'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
  };

  return (
    <div
      className={`relative p-6 shadow-xl transition-transform duration-200 hover:scale-105 hover:border-blue-400/80 ${className}`}
      style={customStyle}
    >
      <div className="pointer-events-none absolute inset-0" style={glowStyle} />

      {/* Diagonal notch lines with blue accent */}
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          bottom: '5px',
          right: '-6px',
          height: '3px',
          width: '24.6px',
          transform: 'rotate(-45deg)',
          zIndex: 2,
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          bottom: '5px',
          left: '-6px',
          height: '3px',
          width: '24.6px',
          transform: 'rotate(45deg)',
          zIndex: 2,
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          top: '5px',
          left: '-6px',
          height: '3px',
          width: '24.6px',
          transform: 'rotate(-45deg)',
          zIndex: 2,
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          top: '5px',
          right: '-6px',
          height: '3px',
          width: '24.6px',
          transform: 'rotate(45deg)',
          zIndex: 2,
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
