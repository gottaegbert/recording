import React, { ReactNode } from 'react';

interface GameCardProps {
  children: ReactNode;
  className?: string;
}

export function GameCard({ children, className = '' }: GameCardProps) {
  return (
    <div
      className={`relative border-2 border-cyan-400/60 bg-gradient-to-br p-6 shadow-xl transition-transform duration-200 hover:scale-105 hover:border-cyan-300/90 ${className}`}
      style={{
        clipPath:
          'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow: '0 0 32px 4px rgba(34,211,238,0.25)',
          zIndex: 1,
        }}
      />
      {/* Diagonal notch line */}
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(34,211,238,0.8)',
          bottom: '5px',
          right: '-6px',
          height: '3px',
          width: '24.6px' /* hypotenuse of 16px notch */,
          transform: 'rotate(-45deg)',
          zIndex: 2,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(34,211,238,0.8)',
          bottom: '5px',
          left: '-6px',
          height: '3px',
          width: '24.6px' /* hypotenuse of 16px notch */,
          transform: 'rotate(45deg)',
          zIndex: 2,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(34,211,238,0.8)',
          top: '5px',
          left: '-6px',
          height: '3px',
          width: '24.6px' /* hypotenuse of 16px notch */,
          transform: 'rotate(-45deg)',
          zIndex: 2,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          backgroundColor: 'rgba(34,211,238,0.8)',
          top: '5px',
          right: '-6px',
          height: '3px',
          width: '24.6px' /* hypotenuse of 16px notch */,
          transform: 'rotate(45deg)',
          zIndex: 2,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
