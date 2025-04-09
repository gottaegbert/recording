'use client';

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

export default function MetalnessPage() {
  return (
    <MotionWrapper>
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
              <MetallicMaterialsDemo />
            </div>
          </Card>
        </div>
      </ContentLayout>
    </MotionWrapper>
  );
}
