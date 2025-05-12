'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

type StatusType = 'Running' | 'Standby' | 'Maintenance' | 'Error';

type MachineryStatusProps = {
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
const generateMachineStatus = () => {
  const statuses: StatusType[] = ['Running', 'Standby', 'Maintenance', 'Error'];
  const statusClasses: Record<StatusType, string> = {
    Running: 'bg-green-500',
    Standby: 'bg-yellow-500',
    Maintenance: 'bg-blue-500',
    Error: 'bg-red-500',
  };

  return Array.from({ length: 5 }, (_, i) => {
    const randomIndex = Math.floor(Math.random() * 100) % 4;
    const status = statuses[randomIndex];

    return {
      id: i + 1,
      name: `Machine ${i + 1}`,
      status,
      statusClass: statusClasses[status],
      temperature: Math.floor(Math.random() * 30) + 40,
      uptime: Math.floor(Math.random() * 24) + 1,
    };
  });
};

export function MachineryStatus({ paused = false }: MachineryStatusProps) {
  const [machines, setMachines] = useState(generateMachineStatus());

  // 模拟数据更新
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setMachines(generateMachineStatus());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="space-y-3 overflow-y-auto pr-2">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className="space-y-2 rounded-md border p-3 transition-colors hover:bg-white/5"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{machine.name}</span>
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full ${machine.statusClass} mr-2`}
              />
              <span className="text-xs">{machine.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs">
              <span className="text-gray-500">Temperature: </span>
              <span className={machine.temperature > 60 ? 'text-red-500' : ''}>
                <AnimatedNumber value={machine.temperature} suffix="°C" />
              </span>
            </div>

            <div className="text-xs">
              <span className="text-gray-500">Uptime: </span>
              <span>
                <AnimatedNumber value={machine.uptime} suffix="h" />
              </span>
            </div>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200/20">
            <div
              className={`${machine.statusClass} h-1`}
              style={{
                width: `${machine.status === 'Error' ? 25 : machine.status === 'Maintenance' ? 50 : machine.status === 'Standby' ? 75 : 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
