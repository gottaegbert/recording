'use client';
import Link from 'next/link';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import SideMenu from '@/components/demo/SideMenu';
import { motion } from 'motion/react';
import ImageShaderComponent from '@/components/demo/Shader/DynamicImagetransition';
import LaserCutShaderComponent from '@/components/demo/Shader/LaserCut';
import WireframeCubeShaderComponent from '@/components/demo/Shader/WireframeCube';
import LaserBorderShaderComponent from '@/components/demo/Shader/LaserBorder';
import LaserLoadingShaderComponent from '@/components/demo/Shader/LaserLoading';
import TwistedBox from '@/components/demo/Shader/TwistedBox';
import { ScrollIndicator } from '@/components/scroll-indicator';
import MotionWrapper from '@/components/transition/motion-wrapper';

export default function WorkingOnPage() {
  return (
    <ContentLayout title="WorkingOn">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>WorkingOn</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MotionWrapper>
        <div className="mt-4 grid min-h-[calc(100vh-200px)] w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* <SideMenu /> */}
          <ImageShaderComponent />
          <LaserCutShaderComponent />
          <WireframeCubeShaderComponent />
          <TwistedBox />
          <LaserBorderShaderComponent />
          <LaserLoadingShaderComponent />
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
