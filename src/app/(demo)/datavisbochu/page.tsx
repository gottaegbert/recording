'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import { IndustryMetrics } from './components/industry-metrics';
import { useState, useEffect } from 'react';
import { PieChart } from './components/charts';
import { ChinaMap } from './components/china-map';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';
import { PauseCircle, PlayCircle } from 'lucide-react';

// 简化的动画计数器组件
function AnimatedCounter({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // 动画开始值
    let startValue = displayValue;
    const endValue = value;
    const startTime = performance.now();

    // 动画帧
    const animateValue = (timestamp: number) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / duration, 1);

      // 使用缓动函数使动画更平滑
      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easedProgress,
      );

      setDisplayValue(currentValue);

      if (runtime < duration) {
        requestAnimationFrame(animateValue);
      }
    };

    // 如果值相同则不执行动画
    if (startValue !== endValue) {
      requestAnimationFrame(animateValue);
    }
  }, [value, duration]);

  // 将数字转换为格式化的字符串并添加千位分隔符
  const formattedValue = displayValue
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="text-4xl font-bold text-white transition-all">
      {formattedValue}
    </div>
  );
}

export default function BochuDataVisPage() {
  const [refreshPaused, setRefreshPaused] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());

  // 卡片数据
  const [partsCount, setPartsCount] = useState(1234);
  const [sheetsCount, setSheetsCount] = useState(312);
  const [utilizationRate, setUtilizationRate] = useState(89.7);
  const [materialSavings, setMaterialSavings] = useState(127);
  const [carbonSavings, setCarbonSavings] = useState(312);

  // Update values periodically
  useEffect(() => {
    if (refreshPaused) return;

    const interval = setInterval(() => {
      setRefreshTime(new Date());
      // 随机小幅度更新数据
      setPartsCount((prev) => Math.floor(prev + Math.random() * 10 - 2));
      setSheetsCount((prev) => Math.floor(prev + Math.random() * 5 - 1));
      setUtilizationRate((prev) =>
        parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      );
      setMaterialSavings((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
      setCarbonSavings((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshPaused]);

  const toggleRefresh = () => setRefreshPaused(!refreshPaused);

  return (
    <MotionWrapper>
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-950/20 via-slate-900/20 to-purple-950/20" />

      {/* Content */}

      <div className="container relative z-10 mx-auto p-6">
        <div className="aspect-ratio-container w-full">
          <Card
            id="dashboard-container"
            className="custom-scrollbar h-full w-full overflow-hidden bg-[#171B23] transition-all duration-300"
          >
            {/* 左上角装饰 */}
            <div className="absolute left-0 top-0 h-full w-full border-l-8 border-t-8 border-blue-500"></div>
            <div className="absolute left-3 top-3 h-6 w-6 border-l border-t border-white"></div>

            {/* 右上角装饰 */}
            <div className="absolute right-3 top-3 h-6 w-6 border-r border-t border-white"></div>

            {/* 左下角装饰 */}
            <div className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-white"></div>

            {/* 右下角装饰 */}
            <div className="absolute bottom-0 right-0 h-full w-full border-b-8 border-r-8 border-blue-500"></div>
            <div className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-blue-400/80"></div>

            {/* 梯形装饰up */}
            <div className="absolute left-1/2 top-0 flex h-8 items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] bg-blue-500"></div>
            </div>
            {/* 梯形装饰down */}
            <div className="absolute bottom-0 left-1/2 flex h-8 scale-y-[-1] items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] bg-blue-500"></div>
            </div>
            {/* 梯形装饰left */}
            <div className="absolute left-2 top-1/2 flex scale-x-[-1] items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] rotate-90 bg-blue-500"></div>
            </div>
            {/* 梯形装饰right */}
            <div className="absolute right-2 top-1/2 flex items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] rotate-90 bg-blue-500"></div>
            </div>

            <div className="dashboard-content h-full overflow-auto p-6">
              {/* 标题栏 */}
              <div className="mb-8 flex items-center justify-between">
                <h1 className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent">
                  BOCHU
                </h1>

                <div className="flex items-center space-x-4">
                  <div className="text-xs text-muted-foreground">
                    更新: {refreshTime.toLocaleTimeString()}
                  </div>
                  <button
                    onClick={toggleRefresh}
                    className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/20"
                  >
                    {refreshPaused ? (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>恢复</span>
                      </>
                    ) : (
                      <>
                        <PauseCircle className="h-3.5 w-3.5" />
                        <span>暂停</span>
                      </>
                    )}
                  </button>
                  <FullscreenButton
                    targetId="dashboard-container"
                    className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/20"
                  />
                </div>
              </div>

              {/* 主标题行 */}
              <div className="mb-8 border-y border-white/10 py-4">
                <h2 className="text-center text-xl font-semibold text-white">
                  赋能全国智能制造，服务40个地区、30万企业
                </h2>
              </div>

              {/* 可视化主体区域 */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* 左侧 - 地图区域 */}
                <div className="col-span-2 space-y-4">
                  <Card className="border border-white/10 bg-[#23272E] shadow-xl backdrop-blur-sm">
                    <div className="p-4">
                      <div className="aspect-video h-full rounded-md">
                        <ChinaMap paused={refreshPaused} />
                      </div>
                      {/* <p className="mt-2 text-sm text-gray-400">
                        通过热力图展示全国客户分布，并标注头部客户
                      </p> */}
                    </div>
                  </Card>
                </div>

                {/* 右侧 - 行业应用区 */}
                <div className="space-y-4">
                  <Card className="h-[400px] border border-white/10 bg-[#23272E] shadow-xl backdrop-blur-sm">
                    <div className="p-4">
                      <h3 className="mb-4 text-lg font-medium text-white">
                        图表（环形图、饼图等）
                      </h3>

                      <div className="h-[250px]">
                        <IndustryMetrics paused={refreshPaused} />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-md bg-[#171B23] p-2">
                          <p className="text-xs text-gray-400">钢结构</p>
                          <p className="font-bold text-blue-400">42%</p>
                        </div>
                        <div className="rounded-md bg-[#171B23] p-2">
                          <p className="text-xs text-gray-400">机械制造</p>
                          <p className="font-bold text-green-400">35%</p>
                        </div>
                        <div className="rounded-md bg-[#171B23] p-2">
                          <p className="text-xs text-gray-400">汽车</p>
                          <p className="font-bold text-purple-400">23%</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* 下方数据卡片区域 */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {/* 当日处理零件数 */}
                <Card className="border border-white/10 bg-[#23272E] p-6 shadow-xl backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-gray-200">
                    当日处理零件数
                  </h3>
                  <div className="mt-2">
                    <AnimatedCounter value={partsCount} />
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-400">↑ 12.5%</span>
                    <span className="ml-1 text-xs text-gray-400">vs 昨日</span>
                  </div>
                </Card>

                {/* 当日板材张数 */}
                <Card className="border border-white/10 bg-[#23272E] p-6 shadow-xl backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-gray-200">
                    当日板材张数
                  </h3>
                  <div className="mt-2">
                    <AnimatedCounter value={sheetsCount} />
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-400">↑ 8.2%</span>
                    <span className="ml-1 text-xs text-gray-400">vs 昨日</span>
                  </div>
                </Card>

                {/* 平均材料利用率 */}
                <Card className="border border-white/10 bg-[#23272E] p-6 shadow-xl backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-gray-200">
                    平均材料利用率
                  </h3>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {utilizationRate}%
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-400">↑ 3.1%</span>
                    <span className="ml-1 text-xs text-gray-400">vs 上月</span>
                  </div>
                </Card>

                {/* 2024节省材料 */}
                <Card className="border border-white/10 bg-[#23272E] p-6 shadow-xl backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-gray-200">
                    2024节省材料
                  </h3>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {materialSavings}吨
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-blue-400">进度: 83%</span>
                    <span className="ml-1 text-xs text-gray-400">年目标</span>
                  </div>
                </Card>

                {/* 2024节省碳排放 */}
                <Card className="border border-white/10 bg-[#23272E] p-6 shadow-xl backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-gray-200">
                    2024节省碳排放
                  </h3>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {carbonSavings}吨
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-blue-400">进度: 78%</span>
                    <span className="ml-1 text-xs text-gray-400">年目标</span>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add CSS for aspect ratio */}
      <style jsx global>{`
        .aspect-ratio-container {
          position: relative;
          max-width: 1800px;
          margin: 0 auto;
        }

        .dashboard-content {
          position: relative;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </MotionWrapper>
  );
}
