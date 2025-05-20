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
import { AnimatedCounter } from './components/animated-counter';
import Image from 'next/image';
import Aurora from '@/components/shader/AuroraShader';
import { GameCard } from './components/game-card';
import { AnimatedTitle } from './components/animated-title';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  ModelWithEdges,
  type MaterialControls,
} from './components/model-with-edges';

export default function BochuDataVisPage() {
  const [refreshPaused, setRefreshPaused] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [hovered, setHovered] = useState(false);

  const materialControls: MaterialControls = {
    metalness: 0.6,
    roughness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    edgeThickness: 0.003,
    edgeColor: '#00a0ff',
  };

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

  const yearDataCard = Object.entries(cardData).map(([key, value]) => (
    <GameCard
      key={key}
      className="bg-[var(--bochu-background-card)] p-8 shadow-lg"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h3 className="text-2xl text-[var(--bochu-primary)]">
            {value.title}
          </h3>

          <div className="mt-1">
            <div className="mt-1 flex items-center">
              {value.increase > 0 ? (
                <span className="text-xl text-[var(--bochu-danger)]">
                  {value.increase > 0 ? '↑' : '↓'} {value.increase}%
                </span>
              ) : (
                <span className="text-xl text-[var(--bochu-success)]">
                  {value.increase > 0 ? '↑' : '↓'} {value.increase}%
                </span>
              )}
              <span className="ml-1 text-xl text-[var(--bochu-text-muted)]">
                vs {value.scale}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-center text-center">
          <div className="text-4xl">
            <div className="text-[var(--bochu-primary)]">{value.value}</div>
          </div>
        </div>
      </div>
    </GameCard>
  ));

  const updateDataCard = Object.entries(cardData).map(([key, value]) => (
    <GameCard key={key}>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          <h3 className="text-2xl text-[var(--bochu-text)]">{value.title}</h3>
        </div>

        <div className="mt-1 flex items-center text-center">
          <div className="text-4xl">
            <AnimatedCounter
              value={value.value}
              color="var(--bochu-primary)"
              duration={500}
              formatter={(val) => val.toLocaleString()}
            />
          </div>
        </div>
      </div>
    </GameCard>
  ));

  return (
    <MotionWrapper>
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-[var(--bochu-background)] via-[var(--bochu-background-dark)] to-[var(--bochu-background)]" />

      {/* Content */}
      <div className="container relative z-10 mx-auto p-8">
        <div className="aspect-video max-h-screen w-full overflow-hidden">
          <Card
            id="dashboard-container"
            className="custom-scrollbar h-full w-full overflow-hidden border border-[var(--bochu-border)] bg-[var(--bochu-background-dark)] transition-all duration-300"
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
            {/* 页脚信息 */}
            <div className="z-1 absolute bottom-0">
              <div className="border-b border-t border-[var(--bochu-border)] bg-gradient-to-r from-[rgba(10,20,30,0.8)] via-[rgba(30,41,59,0.8)] to-[rgba(10,20,30,0.8)] py-1 text-[var(--bochu-primary)] backdrop-blur-sm">
                <HorizontalScrollingText
                  paused={refreshPaused}
                  text="📊 系统数据更新于 2025-05-13 | 📈 当前在线企业: 12,568 | 📱 移动端访问量: 215,689 | 🔄 数据处理量: 1.2TB | 📌 已接入应用数量: 26 | 🛠️ 算法迭代版本: v5.2.1 | 🔍 大数据分析引擎: Flink 1.16.0 | 💼 行业解决方案: 42套 | 🚀 系统响应时间: 0.43秒"
                  speed={30}
                  className="text-lg font-medium"
                />
              </div>
            </div>
            <div className="z-4 absolute left-0 top-0 h-full w-full">
              <div className="border-500 absolute left-0 top-0 h-full w-full border-l-8 border-t-8 border-[var(--bochu-border)]"></div>
              <div className="absolute bottom-0 right-0 h-full w-full border-b-8 border-r-8 border-[var(--bochu-border)]"></div>
              <div className="absolute left-1/2 top-0 flex h-8 items-center justify-center">
                <div className="clip-path-trapezoid absolute h-5 w-[400px] bg-[var(--bochu-border)]"></div>
              </div>
              {/* <div className="absolute bottom-0 left-1/2 flex h-8 scale-y-[-1] items-center justify-center">
                <div className="clip-path-trapezoid absolute h-5 w-[400px] bg-[var(--bochu-border)]"></div>
              </div> */}
              <div className="absolute left-2 top-1/2 flex scale-x-[-1] items-center justify-center">
                <div className="clip-path-trapezoid absolute h-4 w-[300px] rotate-90 bg-[var(--bochu-border)]"></div>
              </div>
              <div className="absolute right-2 top-1/2 flex items-center justify-center">
                <div className="clip-path-trapezoid absolute h-4 w-[300px] rotate-90 bg-[var(--bochu-border)]"></div>
              </div>
            </div>

            <div className="dashboard-content h-full overflow-auto">
              {/* 标题栏 */}
              <div className="mb-4 flex items-center justify-between p-8">
                <div className="relative ml-2 flex items-center">
                  <div className="absolute -inset-1 animate-pulse rounded-none bg-[var(--bochu-glow)] blur-md"></div>
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

                <div className="z-10 flex items-center space-x-4">
                  <div className="text-lg text-[var(--bochu-text-muted)]">
                    更新: {refreshTime.toLocaleTimeString()}
                  </div>
                  <button
                    onClick={toggleRefresh}
                    className="flex items-center space-x-1 rounded-full border border-[var(--bochu-primary)] bg-[var(--bochu-background-card)] px-3 py-1 text-lg text-[var(--bochu-primary)] backdrop-blur-sm hover:bg-[var(--bochu-glow)]"
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
                  <div className="border border-[var(--bochu-border)] bg-[rgba(10,20,30,0.5)] px-4 py-1 text-4xl font-bold text-[var(--bochu-primary)]">
                    09:29:31
                  </div>
                  <FullscreenButton
                    targetId="dashboard-container"
                    className="flex items-center space-x-1 rounded-full border border-[var(--bochu-primary)] bg-[var(--bochu-background-card)] px-3 py-1 text-lg text-[var(--bochu-primary)] backdrop-blur-sm hover:bg-[var(--bochu-glow)]"
                  />
                </div>
              </div>

              <div className="mb-3 p-8">
                {/* 可视化主体区域 */}
                <div className="grid grid-cols-5 lg:grid-cols-5">
                  {/* 左侧 - 实时数据区 */}
                  <div className="z-10 col-span-1">
                    <div className="grid grid-rows-2 gap-4">
                      <div className="row-span-1">{updateDataCard[0]}</div>
                      <div className="row-span-1">{updateDataCard[1]}</div>
                    </div>
                    <div className="relative row-span-1 h-[400px] w-[600px]">
                      <Canvas
                        gl={{
                          antialias: true,
                          alpha: true,
                        }}
                      >
                        <ModelWithEdges
                          materialControls={materialControls}
                          hovered={hovered}
                          setHovered={setHovered}
                        />
                        <OrbitControls
                          enableZoom={false}
                          enablePan={false}
                          minPolarAngle={Math.PI / 3}
                          maxPolarAngle={Math.PI / 2.5}
                        />
                      </Canvas>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 top-12 text-2xl">
                    <AnimatedTitle text="赋能全国智能制造，服务20个地区、30万企业" />
                  </div>
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
                  {/* 中间侧 - 地图区域 */}
                  <div className="z-0 col-span-3">
                    <div className="p-0">
                      <div className="aspect-[3/1.5] h-full">
                        <div className="absolute left-0 right-0 top-0 z-0">
                          <ChinaMap paused={refreshPaused} />
                          <Image
                            src="/datavisbochu/dots-card.png"
                            alt="map"
                            width={1920}
                            height={1090}
                            className="h-screen w-screen"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 右侧 - 行业应用区 */}
                  <div className="z-10 col-span-1">
                    <div className="h-full">
                      <D3PieChart
                        paused={refreshPaused}
                        customerCount={37846}
                        productionCapacity={1870}
                      />
                    </div>
                  </div>
                </div>

                {/* 下方数据卡片区域 */}
                <div className="absolute bottom-20 left-8 right-8 grid grid-cols-3 gap-4">
                  <div className="z-10 col-span-1">{yearDataCard[2]}</div>
                  <div className="z-10 col-span-1">{yearDataCard[3]}</div>
                  <div className="z-10 col-span-1">{yearDataCard[4]}</div>
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
