'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface CarbonSavingsProps {
  paused: boolean;
}

export function CarbonSavings({ paused }: CarbonSavingsProps) {
  // Current carbon savings data
  const [currentSavings, setCurrentSavings] = useState(312);
  const [targetSavings, setTargetSavings] = useState(400);
  const [percentage, setPercentage] = useState(78);

  // Display metrics
  const treesPlanted = Math.floor(currentSavings * 15); // Each ton saves approximately 15 trees
  const waterSaved = Math.floor(currentSavings * 500); // In cubic meters

  // Animation effect
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      // Increase by a small random amount (0.1 to 0.5 tons)
      const increment = Math.random() * 0.4 + 0.1;
      setCurrentSavings((prev) => {
        const newValue = Math.min(prev + increment, targetSavings);
        const newPercentage = Math.floor((newValue / targetSavings) * 100);
        setPercentage(newPercentage);
        return newValue;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [paused, targetSavings]);

  // Calculate gauge angles for the semi-circle
  const gaugeAngle = 180 * (percentage / 100);

  return (
    <div className="relative flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">碳排放节省</h3>
        <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300">
          实时数据
        </span>
      </div>

      {/* Gauge visualization */}
      <div className="relative mx-auto mb-4 aspect-square w-3/4">
        <svg viewBox="0 0 200 100" className="w-full">
          {/* Gauge background */}
          <path
            d="M10,90 A80,80 0 0,1 190,90"
            fill="none"
            stroke="#1A202C"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Gauge fill */}
          <path
            d="M10,90 A80,80 0 0,1 190,90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            className="transition-all duration-1000"
          />

          {/* Add gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#68D391" />
              <stop offset="100%" stopColor="#38B2AC" />
            </linearGradient>
          </defs>

          {/* Gauge marker */}
          <circle
            cx={100 + 80 * Math.cos(((180 - gaugeAngle) * Math.PI) / 180)}
            cy={90 - 80 * Math.sin(((180 - gaugeAngle) * Math.PI) / 180)}
            r="8"
            fill="#38B2AC"
            stroke="#1A202C"
            strokeWidth="1"
            className="transition-all duration-1000"
          />

          {/* Gauge center text */}
          <text x="100" y="95" textAnchor="middle" fontSize="16" fill="#CBD5E0">
            {percentage}%
          </text>

          {/* Gauge labels */}
          <text x="10" y="110" fontSize="10" fill="#A0AEC0">
            0
          </text>
          <text x="190" y="110" fontSize="10" fill="#A0AEC0" textAnchor="end">
            {targetSavings}吨
          </text>
        </svg>
      </div>

      {/* Current value */}
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-white">
          {currentSavings.toFixed(1)}吨
        </div>
        <div className="text-xs text-gray-400">2024年碳排放节省总量</div>
      </div>

      {/* Metrics grid */}
      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="rounded-md bg-slate-800/50 p-3">
          <div className="flex items-center text-green-400">
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
            <span className="text-sm font-medium">相当于种植</span>
          </div>
          <div className="mt-1 text-xl font-bold text-white">
            {treesPlanted} 棵树
          </div>
        </div>

        <div className="rounded-md bg-slate-800/50 p-3">
          <div className="flex items-center text-blue-400">
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
              <path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" />
            </svg>
            <span className="text-sm font-medium">节约用水</span>
          </div>
          <div className="mt-1 text-xl font-bold text-white">
            {waterSaved} 立方米
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-green-400 opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-rise ${Math.random() * 3 + 2}s linear infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes particle-rise {
          0% {
            transform: translateY(20px) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
