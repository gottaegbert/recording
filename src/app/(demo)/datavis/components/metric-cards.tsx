'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart2,
  Clock,
  Zap,
  DollarSign,
  Package,
  AlertCircle,
} from 'lucide-react';

type MetricCardsProps = {
  paused?: boolean;
};

// Generate random metrics
const generateMetrics = () => {
  return [
    {
      id: 1,
      title: 'Productivity',
      value: Math.floor(Math.random() * 20) + 80,
      change: Math.floor(Math.random() * 10) - 4,
      unit: '%',
      icon: <Activity className="h-5 w-5" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 2,
      title: 'Throughput',
      value: Math.floor(Math.random() * 800) + 3200,
      change: Math.floor(Math.random() * 300) - 100,
      unit: 'units',
      icon: <BarChart2 className="h-5 w-5" />,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 3,
      title: 'Uptime',
      value: Math.floor(Math.random() * 5) + 95,
      change: Math.floor(Math.random() * 3) - 1,
      unit: '%',
      icon: <Clock className="h-5 w-5" />,
      color: 'from-violet-500 to-purple-600',
    },
    {
      id: 4,
      title: 'Energy',
      value: Math.floor(Math.random() * 100) + 400,
      change: Math.floor(Math.random() * 50) - 25,
      unit: 'kWh',
      icon: <Zap className="h-5 w-5" />,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 5,
      title: 'Efficiency',
      value: Math.floor(Math.random() * 15) + 75,
      change: Math.floor(Math.random() * 8) - 3,
      unit: '%',
      icon: <Activity className="h-5 w-5" />,
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 6,
      title: 'Revenue',
      value: Math.floor(Math.random() * 50000) + 150000,
      change: Math.floor(Math.random() * 15000) - 5000,
      unit: '$',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 7,
      title: 'Inventory',
      value: Math.floor(Math.random() * 500) + 1000,
      change: Math.floor(Math.random() * 200) - 100,
      unit: 'units',
      icon: <Package className="h-5 w-5" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 8,
      title: 'Incidents',
      value: Math.floor(Math.random() * 5),
      change: Math.floor(Math.random() * 3) - 2,
      unit: '',
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'from-red-500 to-rose-600',
    },
  ];
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

export function MetricCards({ paused = false }: MetricCardsProps) {
  const [metrics, setMetrics] = useState(generateMetrics());
  const [visibleItems, setVisibleItems] = useState(5);
  const containerRef = useRef(null);

  // Update metrics every 5 seconds
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  // Toggle between showing 5 and all metrics
  const toggleVisibleItems = () => {
    setVisibleItems(visibleItems === 5 ? metrics.length : 5);
  };

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {metrics.slice(0, visibleItems).map((metric) => (
          <Card
            key={metric.id}
            className="relative overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm"
          >
            {/* Gradient background accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br opacity-10 ${metric.color}`}
            />

            <div className="relative z-10 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline space-x-1">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {metric.unit === '$' ? metric.unit : ''}
                      <AnimatedNumber value={metric.value} />
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {metric.unit !== '$' ? metric.unit : ''}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-full bg-gradient-to-br ${metric.color} p-2 shadow-lg`}
                >
                  {metric.icon}
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-1">
                {metric.change > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-500">
                      +<AnimatedNumber value={metric.change} />
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-medium text-red-500">
                      <AnimatedNumber value={metric.change} />
                    </span>
                  </>
                )}
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>

              {/* Visual indicator for change */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/30">
                <div
                  className={`h-full ${metric.change > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.abs(metric.change) * 5 + 20}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Show more/less button */}
      <div className="flex justify-center">
        <button
          onClick={toggleVisibleItems}
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          {visibleItems === 5 ? 'Show More Metrics' : 'Show Less Metrics'}
        </button>
      </div>
    </div>
  );
}
