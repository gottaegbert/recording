'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import { useState, useEffect } from 'react';
import { ChinaMap } from './components/china-map';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';
import { PauseCircle, PlayCircle } from 'lucide-react';
import { D3PieChart } from './components/d3-pie-chart';
import {
  TypewriterText,
  HorizontalScrollingText,
} from './components/scrolling-text';
import { FlowingTitle } from './components/animated-title';
import Image from 'next/image';

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
    <div className="text-2xl font-bold text-white transition-all">
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
      <div className="container relative z-10 mx-auto p-4">
        <div className="aspect-video max-h-screen w-full overflow-hidden">
          <Card
            id="dashboard-container"
            className="custom-scrollbar h-full w-full overflow-hidden bg-[#171B23] transition-all duration-300"
          >
            {/* 装饰元素保持不变 */}
            <div className="absolute left-0 top-0 h-full w-full border-l-8 border-t-8 border-blue-500"></div>
            <div className="absolute left-3 top-3 h-6 w-6 border-l border-t border-white"></div>
            <div className="absolute right-3 top-3 h-6 w-6 border-r border-t border-white"></div>
            <div className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-white"></div>
            <div className="absolute bottom-0 right-0 h-full w-full border-b-8 border-r-8 border-blue-500"></div>
            <div className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-blue-400/80"></div>
            <div className="absolute left-1/2 top-0 flex h-8 items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] bg-blue-500"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 flex h-8 scale-y-[-1] items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] bg-blue-500"></div>
            </div>
            <div className="absolute left-2 top-1/2 flex scale-x-[-1] items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] rotate-90 bg-blue-500"></div>
            </div>
            <div className="absolute right-2 top-1/2 flex items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[600px] rotate-90 bg-blue-500"></div>
            </div>

            <div className="dashboard-content h-full overflow-auto p-4">
              {/* 标题栏 */}
              <div className="mb-4 flex items-center justify-between">
                <div className="relative ml-2 flex items-center">
                  <div className="absolute -inset-1 animate-pulse rounded-full bg-blue-500/20 blur-md"></div>
                  <div className="relative">
                    <Image
                      src="/datavisbochu/baichulogo1.svg"
                      alt="bochu"
                      width={100}
                      height={100}
                      className="h-12 w-auto"
                    />
                  </div>
                </div>

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
              <div className="mb-3 border-y border-white/10 py-3">
                <FlowingTitle
                  text="赋能全国智能制造，服务40个地区、30万企业"
                  className="text-xl font-semibold text-white"
                />
              </div>

              {/* 可视化主体区域 */}
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
                {/* 左侧 - 地图区域 */}
                <div className="col-span-3">
                  <Card className="border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] shadow-xl backdrop-blur-sm">
                    <div className="p-0">
                      <div className="aspect-[3/1.5] h-full rounded-md">
                        <ChinaMap paused={refreshPaused} />
                        <div className="absolute left-0 right-0 top-0">
                          <TypewriterText
                            paused={refreshPaused}
                            messages={[
                              '最新数据：华东地区客户增长12.5%，同比增长显著',
                              '系统更新：新增智能排产算法，提升生产效率22%',
                              '行业动态：钢结构行业上半年增速8.7%，位居制造业前列',
                              '热点区域：北京、上海、深圳客户活跃度持续上升',
                              '技术突破：新一代优化引擎上线，材料利用率提升3.1%',
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 右侧 - 行业应用区 */}
                <div className="lg:flex lg:flex-col">
                  <Card className="h-full border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] shadow-xl backdrop-blur-sm">
                    <div className="h-full p-3">
                      <D3PieChart
                        paused={refreshPaused}
                        title="行业应用分布"
                        customerCount={37846}
                        productionCapacity={1870}
                      />
                    </div>
                  </Card>
                </div>
              </div>

              {/* 下方数据卡片区域 */}
              <div className="mt-3 grid grid-cols-5 gap-3">
                {/* 当日处理零件数 */}
                <Card className="border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] p-3 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-blue-300/80">
                      当日处理零件数
                    </h3>
                    <div className="mt-1">
                      <div className="text-xl font-bold text-white">
                        <AnimatedCounter value={partsCount} />
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-green-400">↑ 12.5%</span>
                        <span className="ml-1 text-xs text-gray-400">
                          vs 昨日
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 当日板材张数 */}
                <Card className="border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] p-3 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-blue-300/80">
                      当日板材张数
                    </h3>
                    <div className="mt-1">
                      <div className="text-xl font-bold text-white">
                        <AnimatedCounter value={sheetsCount} />
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-green-400">↑ 8.2%</span>
                        <span className="ml-1 text-xs text-gray-400">
                          vs 昨日
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 平均材料利用率 */}
                <Card className="border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] p-3 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-blue-300/80">
                      平均材料利用率
                    </h3>
                    <div className="mt-1">
                      <div className="flex items-baseline text-xl font-bold text-white">
                        <AnimatedCounter value={utilizationRate} />
                        <span className="ml-1 text-xs text-gray-400">%</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-green-400">↑ 3.1%</span>
                        <span className="ml-1 text-xs text-gray-400">
                          vs 上月
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 2024节省材料 */}
                <Card className="border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] p-3 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-blue-300/80">
                      2024节省材料
                    </h3>
                    <div className="mt-1">
                      <div className="flex items-baseline text-xl font-bold text-white">
                        <AnimatedCounter value={materialSavings} />
                        <span className="ml-1 text-xs text-gray-400">吨</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-blue-400">进度: 83%</span>
                        <span className="ml-1 text-xs text-gray-400">
                          年目标
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 2024节省碳排放 */}
                <Card className="border-none bg-gradient-to-br from-[#23272E] to-[#1A202C] p-3 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-blue-300/80">
                      2024节省碳排放
                    </h3>
                    <div className="mt-1">
                      <div className="flex items-baseline text-xl font-bold text-white">
                        <AnimatedCounter value={carbonSavings} />
                        <span className="ml-1 text-xs text-gray-400">吨</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-blue-400">进度: 78%</span>
                        <span className="ml-1 text-xs text-gray-400">
                          年目标
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 页脚信息 */}
              <div className="mt-3 pt-1">
                <div className="rounded-lg bg-gradient-to-r from-[#1A202C]/80 via-[#1e293b]/80 to-[#1A202C]/80 py-1 text-[#90CDF4] backdrop-blur-sm">
                  <HorizontalScrollingText
                    paused={refreshPaused}
                    text="📊 系统数据更新于 2025-05-13 | 📈 当前在线企业: 12,568 | 📱 移动端访问量: 215,689 | 🔄 数据处理量: 1.2TB | 📌 已接入应用数量: 26 | 🛠️ 算法迭代版本: v5.2.1 | 🔍 大数据分析引擎: Flink 1.16.0 | 💼 行业解决方案: 42套 | 🚀 系统响应时间: 0.43秒"
                    speed={30}
                    className="text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add CSS for aspect ratio */}
      <style jsx global>{`
        .aspect-video {
          aspect-ratio: 16 / 9;
        }

        .dashboard-content {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1200px) {
          .dashboard-content {
            max-height: 100%;
          }
        }
      `}</style>
    </MotionWrapper>
  );
}
