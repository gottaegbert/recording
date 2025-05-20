'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

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
const generateLineData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}月`,
    value: Math.floor(Math.random() * 50) + 50,
  }));
};

const generateBarData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 50,
  }));
};

const generatePieData = () => {
  return [
    { name: 'Electricity', value: Math.floor(Math.random() * 40) + 30 },
    { name: 'Gas', value: Math.floor(Math.random() * 30) + 20 },
    { name: 'Water', value: Math.floor(Math.random() * 20) + 10 },
    { name: 'Other', value: Math.floor(Math.random() * 10) + 5 },
  ];
};

type ChartProps = {
  paused?: boolean;
};

export function LineChart({ paused = false }: ChartProps) {
  const [data, setData] = useState(generateLineData());
  const maxValue = Math.max(...data.map((d) => d.value)) + 10;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const avg = Math.round(total / data.length);

  // 模拟数据更新
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setData(generateLineData());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="relative h-64 w-full">
      <div className="absolute inset-x-0 top-0 flex items-center justify-center space-x-4 text-lg">
        <div>
          <span className="text-sm text-gray-500">Average: </span>
          <span className="font-semibold">
            <AnimatedNumber value={avg} />
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Total: </span>
          <span className="font-semibold">
            <AnimatedNumber value={total} />
          </span>
        </div>
      </div>
      <div className="absolute inset-0 mt-8 flex items-end">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex h-full flex-1 flex-col items-center justify-end"
          >
            <motion.div
              className="w-4 rounded-t-sm bg-blue-500"
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <span className="mt-1 origin-top-left -rotate-45 text-xs">
              {item.month}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 mt-8 flex w-10 flex-col justify-between">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="text-xs text-gray-500">
            {Math.round(maxValue - (i * maxValue) / 4)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChart({ paused = false }: ChartProps) {
  const [data, setData] = useState(generateBarData());
  const maxValue = Math.max(...data.map((d) => d.value)) + 10;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // 模拟数据更新
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setData(generateBarData());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="relative h-64 w-full">
      <div className="absolute inset-x-0 top-0 flex items-center justify-center text-lg">
        <span className="text-sm text-gray-500">Total: </span>
        <span className="ml-1 font-semibold">
          <AnimatedNumber value={total} />
        </span>
      </div>
      <div className="absolute inset-0 mt-8 flex items-end">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex h-full flex-1 flex-col items-center justify-end"
          >
            <motion.div
              className="w-5 rounded-t-md bg-gradient-to-t from-green-600 to-green-400 shadow-lg"
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: index * 0.05,
              }}
            />
            <span className="mt-1 text-xs">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 mt-8 flex w-10 flex-col justify-between">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="text-xs text-gray-500">
            {Math.round(maxValue - (i * maxValue) / 4)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PieChart({ paused = false }: ChartProps) {
  const [data, setData] = useState(generatePieData());
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // 模拟数据更新
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setData(generatePieData());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  // 计算饼图各部分的角度和位置
  let currentAngle = 0;
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
  ];

  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="relative h-40 w-40">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className={`absolute inset-0 ${colors[index % colors.length]}`}
                style={{
                  clipPath: `conic-gradient(from ${startAngle}deg, currentColor ${angle}deg, transparent ${angle}deg)`,
                }}
                initial={{ transform: 'scale(0.8)' }}
                animate={{ transform: 'scale(1)' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </motion.div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-background"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedNumber value={total} suffix=" kWh" />
          </motion.div>
        </div>
      </div>
      <div className="ml-4 space-y-1">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <div className={`h-3 w-3 ${colors[index % colors.length]} mr-2`} />
            <span className="text-xs">
              {item.name} (
              <AnimatedNumber
                value={Math.round((item.value / total) * 100)}
                suffix="%"
              />
              )
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
