'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import { LineChart, BarChart, PieChart } from './components/charts';
import { IndustryMetrics } from './components/industry-metrics';
import { MachineryStatus } from './components/machinery-status';
import { ProductionOverview } from './components/production-overview';
import { MetricCards } from './components/metric-cards';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';
import { PauseCircle, PlayCircle, LayoutGrid, LayoutList } from 'lucide-react';

export default function DataVisPage() {
  const [refreshPaused, setRefreshPaused] = useState(false);
  const [layoutCompact, setLayoutCompact] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Update last refresh time
  useEffect(() => {
    if (refreshPaused) return;

    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshPaused]);

  const toggleRefresh = () => setRefreshPaused(!refreshPaused);
  const toggleLayout = () => setLayoutCompact(!layoutCompact);

  const dashboardContent = (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent">
          Industrial Data Visualization
        </h1>

        <div className="mt-4 flex items-center space-x-4 md:mt-0">
          <div className="text-xs text-muted-foreground">
            Last updated: {refreshTime.toLocaleTimeString()}
          </div>
          <button
            onClick={toggleRefresh}
            className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/20"
          >
            {refreshPaused ? (
              <>
                <PlayCircle className="h-3.5 w-3.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <PauseCircle className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            )}
          </button>
          <button
            onClick={toggleLayout}
            className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/20"
          >
            {layoutCompact ? (
              <>
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <LayoutList className="h-3.5 w-3.5" />
                <span>Compact</span>
              </>
            )}
          </button>
          <FullscreenButton
            targetId="dashboard-container"
            className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/20"
          />
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none">
          {/* Metric Cards Row */}
          <div className="mb-8">
            <MetricCards paused={refreshPaused} />
          </div>

          {/* Main Dashboard Grid */}
          <div
            className={`grid gap-6 ${
              layoutCompact
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 lg:grid-cols-3'
            }`}
          >
            {/* First Column */}
            <div
              className={
                layoutCompact
                  ? ''
                  : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2'
              }
            >
              <Card className="relative overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                <div className="p-4">
                  <h2 className="mb-4 text-xl font-semibold">
                    Production Overview
                  </h2>
                  <ProductionOverview paused={refreshPaused} />
                </div>
              </Card>

              {!layoutCompact && (
                <Card className="relative overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                  <div className="p-4">
                    <h2 className="mb-4 text-xl font-semibold">Daily Output</h2>
                    <BarChart paused={refreshPaused} />
                  </div>
                </Card>
              )}

              {!layoutCompact && (
                <div className="grid grid-cols-3 gap-6 md:col-span-2">
                  <Card className="relative col-span-2 overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                    <div className="p-4">
                      <h2 className="mb-4 text-xl font-semibold">
                        Efficiency Trends
                      </h2>
                      <LineChart paused={refreshPaused} />
                    </div>
                  </Card>

                  <Card className="relative col-span-1 overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                    <div className="p-4">
                      <h2 className="mb-4 text-xl font-semibold">
                        Industry Metrics
                      </h2>
                      <IndustryMetrics paused={refreshPaused} />
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Middle/Second Column */}
            {layoutCompact && (
              <div>
                <Card className="relative h-full overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                  <div className="h-full p-4">
                    <h2 className="mb-4 text-xl font-semibold">Daily Output</h2>
                    <BarChart paused={refreshPaused} />
                  </div>
                </Card>
              </div>
            )}

            {/* Third Column */}
            <div className={layoutCompact ? '' : 'h-full space-y-6'}>
              <Card className="relative h-full overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                <div className="flex h-full flex-col p-4">
                  <h2 className="mb-4 text-xl font-semibold">
                    Equipment Status
                  </h2>
                  <div className="flex-grow">
                    <MachineryStatus paused={refreshPaused} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="production" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-4">
              <h2 className="mb-4 text-xl font-semibold">Production Trends</h2>
              <LineChart paused={refreshPaused} />
            </Card>
            <Card className="p-4">
              <h2 className="mb-4 text-xl font-semibold">Production KPIs</h2>
              <IndustryMetrics paused={refreshPaused} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="mt-0">
          <Card className="p-4">
            <h2 className="mb-4 text-xl font-semibold">Equipment Status</h2>
            <MachineryStatus paused={refreshPaused} />
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="mt-0">
          <Card className="p-4">
            <h2 className="mb-4 text-xl font-semibold">Energy Consumption</h2>
            <PieChart paused={refreshPaused} />
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <MotionWrapper>
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-950/20 via-slate-900/20 to-purple-950/20" />

      {/* Content */}
      <div className="container relative z-10 mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">
          Data Visualization Dashboard
        </h1>

        <div className="aspect-ratio-container w-full">
          <Card
            id="dashboard-container"
            className="aspect-16/9 h-full w-full overflow-hidden transition-all duration-300"
          >
            <div className="dashboard-content h-full overflow-auto p-6">
              {dashboardContent}
            </div>
          </Card>
        </div>
      </div>

      {/* Add CSS for aspect ratio */}
      <style jsx global>{`
        .aspect-16\/9 {
          aspect-ratio: 16/9;
        }

        .aspect-ratio-container {
          position: relative;
          max-width: 1600px;
          margin: 0 auto;
        }

        .dashboard-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Add styles for fullscreen mode */
        #dashboard-container:fullscreen {
          padding: 20px;
          background: linear-gradient(
            to bottom right,
            rgba(30, 58, 138, 0.05),
            rgba(15, 23, 42, 0.05),
            rgba(88, 28, 135, 0.05)
          );
          overflow: auto;
        }
      `}</style>
    </MotionWrapper>
  );
}
