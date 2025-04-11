'use client';

import { useState, useEffect } from 'react';
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
import LoadingScene from './LoadingScene';

export default function CutPage() {
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
              <Link href="/3d/cut">Cut</Link>
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
            <LoadingScene onFinishLoading={handleLoaded} />
          </Card>
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
