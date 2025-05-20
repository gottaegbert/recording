'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, animate } from 'motion/react';

type IndustryMetricsProps = {
  paused?: boolean;
};

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

const AnimatedNumber = ({ value, duration = 2 }: AnimatedNumberProps) => {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration });

    const unsubscribe = motionValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [motionValue, value, duration]);

  return <span>{displayValue}</span>;
};

// 模拟数据
const generateMetrics = () => {
  return {
    production: Math.floor(Math.random() * 50) + 150,
    quality: Math.floor(Math.random() * 5) + 95,
    efficiency: Math.floor(Math.random() * 10) + 85,
    downtime: Math.floor(Math.random() * 5) + 1,
  };
};

export function IndustryMetrics({ paused = false }: IndustryMetricsProps) {
  const [metrics, setMetrics] = useState(generateMetrics());

  // 模拟数据更新
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Daily Production (tons)</span>
        <span className="font-semibold">
          <AnimatedNumber value={metrics.production} />
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm">Product Quality (%)</span>
          <span className="font-semibold">
            <AnimatedNumber value={metrics.quality} />%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/20">
          <div
            className="h-2 bg-green-500"
            style={{ width: `${metrics.quality}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm">Production Efficiency (%)</span>
          <span className="font-semibold">
            <AnimatedNumber value={metrics.efficiency} />%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/20">
          <div
            className="h-2 bg-blue-500"
            style={{ width: `${metrics.efficiency}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm">Downtime (hours)</span>
          <span className="font-semibold">
            <AnimatedNumber value={metrics.downtime} />
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/20">
          <div
            className="h-2 bg-red-500"
            style={{ width: `${metrics.downtime * 10}%` }}
          />
        </div>
      </div>
    </div>
  );
}
