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
import Aurora from '@/components/shader/AuroraShader';

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
    <div className="text-3xl text-blue-300 transition-all">
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

  const cardData = {
    partsCount: {
      title: '今日处理零件数',
      value: partsCount,
      increase: 12.5,
      scale: '昨日',
    },
    sheetsCount: {
      title: '今日板材张数',
      value: sheetsCount,
      increase: -8.2,
      scale: '昨日',
    },
    utilizationRate: {
      title: '平均材料利用率',
      value: utilizationRate,
      increase: 3.1,
      scale: '昨日',
    },
    materialSavings: {
      title: '2024年节省材料',
      value: materialSavings,
      increase: 83,
      scale: '去年',
    },
    carbonSavings: {
      title: '2024年节省碳排放',
      value: carbonSavings,
      increase: 78,
      scale: '去年',
    },
  };
  const dataCard = Object.entries(cardData).map(([key, value]) => (
    <Card
      key={key}
      className="rounded-none bg-gradient-to-br from-[#23272e30] to-[#1A202C30] p-8"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h3 className="text-2xl text-blue-300/80">{value.title}</h3>

          <div className="mt-1">
            <div className="mt-1 flex items-center">
              {value.increase > 0 ? (
                <span className="text-xl text-red-400">
                  {value.increase > 0 ? '↑' : '↓'} {value.increase}%
                </span>
              ) : (
                <span className="text-xl text-green-400">
                  {value.increase > 0 ? '↑' : '↓'} {value.increase}%
                </span>
              )}
              <span className="ml-1 text-xl text-gray-400">
                vs {value.scale}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-center text-center">
          <div className="text-8xl">
            <AnimatedCounter value={value.value} />
          </div>
        </div>
      </div>
    </Card>
  ));

  return (
    <MotionWrapper>
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-950/20 via-slate-900/20 to-purple-950/20" />

      {/* Content */}
      <div className="container relative z-10 mx-auto p-8">
        <div className="aspect-video max-h-screen w-full overflow-hidden">
          <Card
            id="dashboard-container"
            className="custom-scrollbar h-full w-full overflow-hidden bg-[#171B23] transition-all duration-300"
          >
            {/* 装饰元素保持不变 */}
            <div className="absolute left-0 top-0 h-full w-full">
              <Aurora
                colorStops={['#223399', '#3399d9', '#223399']}
                blend={0.5}
                amplitude={0.5}
                speed={0.5}
              />
            </div>
            <div className="border-500 absolute left-0 top-0 h-full w-full border-l-8 border-t-8 border-blue-800"></div>
            {/* <div className="absolute left-3 top-8 h-6 w-6 border-l border-t border-white"></div>
            <div className="absolute right-3 top-8 h-6 w-6 border-r border-t border-white"></div>
            <div className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-white"></div>
            <div className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-white"></div> */}
            <div className="absolute bottom-0 right-0 h-full w-full border-b-8 border-r-8 border-blue-800"></div>
            <div className="absolute left-1/2 top-0 flex h-8 items-center justify-center">
              <div className="clip-path-trapezoid absolute h-5 w-[400px] bg-blue-800"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 flex h-8 scale-y-[-1] items-center justify-center">
              <div className="clip-path-trapezoid absolute h-5 w-[400px] bg-blue-800"></div>
            </div>
            <div className="absolute left-2 top-1/2 flex scale-x-[-1] items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[300px] rotate-90 bg-blue-800"></div>
            </div>
            <div className="absolute right-2 top-1/2 flex items-center justify-center">
              <div className="clip-path-trapezoid absolute h-4 w-[300px] rotate-90 bg-blue-800"></div>
            </div>
            <div className="dashboard-content h-full overflow-auto">
              {/* 标题栏 */}
              <div className="mb-4 flex items-center justify-between p-8">
                <div className="relative ml-2 flex items-center">
                  <div className="absolute -inset-1 animate-pulse rounded-none bg-blue-500/20 blur-md"></div>
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
                  <div className="text-lg text-muted-foreground">
                    更新: {refreshTime.toLocaleTimeString()}
                  </div>
                  <button
                    onClick={toggleRefresh}
                    className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-lg backdrop-blur-sm hover:bg-white/20"
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
                    className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-lg backdrop-blur-sm hover:bg-white/20"
                  />
                </div>
              </div>

              {/* 主标题行 */}
              <div className="mb-3 py-3">
                <FlowingTitle
                  text="赋能全国智能制造，服务40个地区，30万企业"
                  className="text-4xl font-semibold text-white"
                />
              </div>

              <div className="mb-3 p-8">
                {/* 可视化主体区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-4">
                  {/* 左侧 - 地图区域 */}
                  <div className="col-span-3">
                    <Card className="rounded-none bg-gradient-to-br from-[#23272e30] to-[#1A202C30] shadow-xl backdrop-blur-sm">
                      <div className="p-0">
                        <div className="aspect-[3/1.5] h-full">
                          <div className="absolute left-0 right-0 top-0">
                            <Image
                              src="/datavisbochu/dots-card.png"
                              alt="map"
                              width={1000}
                              height={1000}
                              className="h-full w-full"
                            />
                          </div>
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
                    <Card className="h-full rounded-none bg-gradient-to-br from-[#23272E30] to-[#1A202C30] shadow-xl backdrop-blur-sm">
                      <div className="h-full">
                        <D3PieChart
                          paused={refreshPaused}
                          customerCount={37846}
                          productionCapacity={1870}
                        />
                      </div>
                    </Card>
                  </div>
                </div>

                {/* 下方数据卡片区域 */}
                <div className="grid grid-cols-5">
                  <div className="col-span-1">{dataCard[0]}</div>
                  <div className="col-span-1">{dataCard[1]}</div>
                  <div className="col-span-1">{dataCard[2]}</div>
                  <div className="col-span-1">{dataCard[3]}</div>
                  <div className="col-span-1">{dataCard[4]}</div>
                </div>
              </div>

              {/* 页脚信息 */}
              <div className="mt-3 pt-1">
                <div className="rounded-lg bg-gradient-to-r from-[#1A202C]/80 via-[#1e293b]/80 to-[#1A202C]/80 py-1 text-[#90CDF4] backdrop-blur-sm">
                  <HorizontalScrollingText
                    paused={refreshPaused}
                    text="📊 系统数据更新于 2025-05-13 | 📈 当前在线企业: 12,568 | 📱 移动端访问量: 215,689 | 🔄 数据处理量: 1.2TB | 📌 已接入应用数量: 26 | 🛠️ 算法迭代版本: v5.2.1 | 🔍 大数据分析引擎: Flink 1.16.0 | 💼 行业解决方案: 42套 | 🚀 系统响应时间: 0.43秒"
                    speed={30}
                    className="text-lg font-medium"
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
