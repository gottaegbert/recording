'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

type ProductionOverviewProps = {
  paused?: boolean;
};

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
}

const AnimatedNumber = ({
  value,
  duration = 2,
  suffix = '',
}: AnimatedNumberProps) => {
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

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

// 模拟数据
const generateProductionData = () => {
  const targetProduction = 200;
  const currentProduction = Math.floor(Math.random() * 50) + 150;
  const percentageComplete = Math.round(
    (currentProduction / targetProduction) * 100,
  );

  return {
    targetProduction,
    currentProduction,
    percentageComplete,
    status:
      percentageComplete >= 90
        ? 'Excellent'
        : percentageComplete >= 75
          ? 'Good'
          : percentageComplete >= 50
            ? 'Average'
            : 'Need Improvement',
    statusClass:
      percentageComplete >= 90
        ? 'text-green-500'
        : percentageComplete >= 75
          ? 'text-blue-500'
          : percentageComplete >= 50
            ? 'text-yellow-500'
            : 'text-red-500',
    lastUpdated: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

export function ProductionOverview({
  paused = false,
}: ProductionOverviewProps) {
  const [data, setData] = useState(generateProductionData());

  // 模拟数据更新
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setData(generateProductionData());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            {/* 背景圆环 */}
            <circle
              className="fill-none stroke-gray-200/20"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
            />
            {/* 进度圆环 */}
            <circle
              className="fill-none stroke-current text-blue-500"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * data.percentageComplete) / 100}
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="50"
              dy="0.35em"
              textAnchor="middle"
              className="fill-foreground text-2xl font-bold"
            >
              <AnimatedNumber value={data.percentageComplete} suffix="%" />
            </text>
          </svg>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-500">Production Target Completion</p>
          <p className={`text-sm font-medium ${data.statusClass}`}>
            {data.status}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="rounded-md border p-2 transition-colors hover:bg-white/5">
          <p className="text-sm text-gray-500">Current Output</p>
          <p className="font-semibold">
            <AnimatedNumber value={data.currentProduction} />
          </p>
        </div>
        <div className="rounded-md border p-2 transition-colors hover:bg-white/5">
          <p className="text-sm text-gray-500">Target Output</p>
          <p className="font-semibold">{data.targetProduction}</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        Last updated: {data.lastUpdated}
      </div>
    </div>
  );
}
