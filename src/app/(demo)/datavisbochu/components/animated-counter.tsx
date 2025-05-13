'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  from,
  to,
  duration = 2,
  delay = 0,
  formatter = (value: number) => value.toLocaleString(),
  className = '',
}: AnimatedCounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) =>
    formatter(Math.round(latest)),
  );
  const [displayValue, setDisplayValue] = useState(formatter(from));

  useEffect(() => {
    const animation = animate(count, to, { duration, delay });

    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [count, rounded, to, duration, delay]);

  return <span className={className}>{displayValue}</span>;
}

interface StatsCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  unit = '',
  icon,
  delay = 0,
}: StatsCardProps) {
  return (
    <div className="rounded-lg bg-[#1e293b] p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <div className="text-2xl font-bold text-white">
          <AnimatedCounter from={0} to={value} delay={delay} />
        </div>
        {unit && <span className="ml-1 text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatsCard title="客户总数" value={37846} delay={0.2} />
      <StatsCard title="制造产能" value={215876} unit="吨" delay={0.4} />
    </div>
  );
}
