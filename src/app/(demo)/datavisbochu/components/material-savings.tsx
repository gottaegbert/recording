'use client';

import React, { useEffect, useState } from 'react';

interface MaterialSavingsProps {
  paused: boolean;
}

export function MaterialSavings({ paused }: MaterialSavingsProps) {
  // Monthly material savings data in tons
  const [monthlyData, setMonthlyData] = useState([
    { month: '1月', value: 8.2, label: '8.2吨' },
    { month: '2月', value: 9.5, label: '9.5吨' },
    { month: '3月', value: 11.3, label: '11.3吨' },
    { month: '4月', value: 12.8, label: '12.8吨' },
    { month: '5月', value: 14.1, label: '14.1吨' },
    { month: '6月', value: 16.7, label: '16.7吨' },
    { month: '7月', value: 18.4, label: '18.4吨' },
    { month: '8月', value: 17.5, label: '17.5吨' },
    { month: '9月', value: 19.1, label: '19.1吨' },
    { month: '10月', value: 0, label: '预测' },
    { month: '11月', value: 0, label: '预测' },
    { month: '12月', value: 0, label: '预测' },
  ]);

  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [totalSavings, setTotalSavings] = useState(127.6);
  const [monthlyTarget, setMonthlyTarget] = useState(18);

  // Update the current month's data
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setMonthlyData((prev) => {
        // Get current month (0-11)
        const currentMonth = new Date().getMonth();

        // For demo purposes, ensure we show at least 9 months of data
        const updateMonth = Math.min(currentMonth, 8);

        if (updateMonth < 9) {
          const newData = [...prev];
          // Small random increase (0.1 to 0.3 tons)
          const increment = Math.random() * 0.2 + 0.1;
          newData[updateMonth].value += increment;
          newData[updateMonth].label =
            `${newData[updateMonth].value.toFixed(1)}吨`;

          // Update total savings
          setTotalSavings((prev) => prev + increment);

          return newData;
        }

        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  // Calculate the maximum value for scaling
  const maxValue =
    Math.max(...monthlyData.map((d) => d.value), monthlyTarget) * 1.1;

  // Handle bar hover
  const handleBarHover = (index: number) => {
    setActiveBar(index);
  };

  const handleBarLeave = () => {
    setActiveBar(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">材料节省趋势</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">年目标:</span>
          <span className="text-sm font-medium text-blue-400">150吨</span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-400">已完成:</span>
          <span className="text-sm font-medium text-green-400">
            {Math.floor(totalSavings)}吨
          </span>
        </div>
      </div>

      {/* Monthly target indicator */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-gray-400">月度目标: {monthlyTarget}吨</span>
        <div className="flex items-center">
          <div className="mr-1 h-2 w-2 rounded-full bg-green-400"></div>
          <span className="text-gray-300">实际</span>
          <div className="ml-3 mr-1 h-2 w-2 rounded-full bg-blue-400"></div>
          <span className="text-gray-300">预测</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative mt-2 flex-grow">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-yellow-400/50 opacity-70"
          style={{ top: `${(1 - monthlyTarget / maxValue) * 100}%` }}
        >
          <div className="absolute -top-2 right-0 rounded bg-yellow-400/20 px-1 text-xs text-yellow-300">
            目标
          </div>
        </div>

        {/* Bars container */}
        <div className="flex h-[200px] w-full items-end justify-between px-1">
          {monthlyData.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            const isActive = activeBar === index;
            const isPrediction = index > 8;

            return (
              <div
                key={item.month}
                className="group relative flex flex-col items-center"
                style={{ width: `${100 / monthlyData.length}%` }}
                onMouseEnter={() => handleBarHover(index)}
                onMouseLeave={handleBarLeave}
              >
                {/* Bar */}
                <div
                  className={`w-full max-w-[20px] rounded-t transition-all duration-300 ${
                    isPrediction
                      ? 'bg-blue-500/30 group-hover:bg-blue-500/50'
                      : item.value >= monthlyTarget
                        ? 'bg-green-500 group-hover:bg-green-400'
                        : 'bg-green-600/70 group-hover:bg-green-500'
                  } ${isActive ? 'opacity-100' : 'opacity-80'}`}
                  style={{
                    height: `${height}%`,
                    minHeight: isPrediction ? '20%' : '5%',
                  }}
                >
                  {isPrediction && (
                    <div className="absolute -top-1 left-0 right-0 flex justify-center">
                      <div className="h-[1px] w-3/4 border-t border-dashed border-blue-400/70"></div>
                    </div>
                  )}
                </div>

                {/* Month label */}
                <div className="mt-1 text-xs text-gray-400">{item.month}</div>

                {/* Value tooltip */}
                {isActive && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs text-white">
                    {isPrediction ? '预测值' : item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-md bg-slate-800/50 p-3">
        <div className="mb-1 text-xs text-gray-400">材料节省效果分析</div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white">同比增长</div>
          <div className="text-lg font-bold text-green-400">+23.5%</div>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-700">
          <div className="h-full w-[63%] rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
