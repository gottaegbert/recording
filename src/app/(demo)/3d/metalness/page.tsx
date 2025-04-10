'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import MetallicMaterialsDemo from './metalness';
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
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';

// 加载动画组件
const LoadingSpinner = () => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-neutral-200 border-t-yellow-500"></div>
    <p className="mt-4 text-lg font-medium text-neutral-300">加载中...</p>
    <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-neutral-700">
      <div className="h-full w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
    </div>
  </div>
);

export default function MetalnessPage() {
  // 添加加载状态
  const [isLoading, setIsLoading] = useState(true);

  // 处理加载完成的回调
  const handleLoaded = () => {
    setIsLoading(false);
  };

  // 使用useEffect确保即使加载速度很快也至少显示一小段时间的加载动画
  useEffect(() => {
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(minLoadingTime);
  }, []);

  return (
    <ContentLayout title="3D">
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
              <Link href="/3d">3d</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link href="/3d/metalness">Metalness</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MotionWrapper>
        <div className="container mx-auto p-6">
          <Card
            id="metalness-container"
            className="relative h-[calc(100vh-200px)] overflow-hidden"
          >
            <FullscreenButton
              targetId="metalness-container"
              className="absolute right-2 top-2 z-10 flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/20"
            />
            <div className="h-full w-full">
              {isLoading ? (
                <div className="relative h-full w-full bg-neutral-900">
                  <LoadingSpinner />
                </div>
              ) : null}

              <div
                className={`h-full w-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
              >
                <MetallicMaterialsDemo onLoaded={handleLoaded} />
              </div>
            </div>
          </Card>
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
