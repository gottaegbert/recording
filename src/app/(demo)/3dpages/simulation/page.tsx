'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import Link from 'next/link';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbList,
  BreadcrumbItem,
} from '@/components/ui/breadcrumb';
import dynamic from 'next/dynamic';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';
import { RefreshButton } from '@/components/refresh-button';
import { CardLoadingAnimation } from '@/components/animations';
import { useState, useRef, useEffect } from 'react';

// Use dynamic import with SSR disabled for Three.js component
const Simulation = dynamic(() => import('./simulation'), { ssr: false });

export default function SimulationPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshStart = () => {
    setIsRefreshing(true);
  };

  const handleRefreshComplete = () => {
    // Increment the key to force a complete re-mount of the simulation
    setRefreshKey((prev) => prev + 1);
    setIsRefreshing(false);
  };

  return (
    <ContentLayout title="3D Simulation">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/3dpages">3d Pages</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link href="/3dpages/simulation">Simulation</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MotionWrapper>
        <div className="container mx-auto p-6">
          <Card
            id="simulation-container"
            className="relative overflow-hidden"
            style={{
              height: 'calc(100vh - 200px)',
              width: '100%',
              minHeight: '500px',
            }}
          >
            <div className="absolute right-2 top-2 z-10 flex items-center space-x-2">
              <RefreshButton
                targetId="simulation-container"
                className="flex items-center space-x-1 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
                onRefreshStart={handleRefreshStart}
                onRefreshComplete={handleRefreshComplete}
              />
              <FullscreenButton
                targetId="simulation-container"
                className="flex items-center space-x-1 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
              />
            </div>
            <div
              className="h-full w-full"
              style={{ position: 'absolute', inset: 0 }}
            >
              {isRefreshing ? (
                <CardLoadingAnimation
                  onAnimationComplete={handleRefreshComplete}
                  cardText="Refreshing Simulation..."
                />
              ) : (
                // The key forces a complete remount when refreshed
                <Simulation key={refreshKey} />
              )}
            </div>
          </Card>
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
