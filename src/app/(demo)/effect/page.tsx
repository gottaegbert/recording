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

import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';

import CursorBall from '@/components/demo/3D/CursorBall';
import GradientBackground from '@/components/demo/Shader/GradientBackground';
import FlowerShaderComponent from '@/components/demo/Shader/Flower';
import MotionWrapper from '@/components/transition/motion-wrapper';
import DynamicImageTransition from '@/components/demo/Shader/DynamicImagetransition';
import LaserBorderShaderComponent from '@/components/demo/Shader/LaserBorder';
import LaserLoadingShaderComponent from '@/components/demo/Shader/LaserLoading';
import WireframeCubeShaderComponent from '@/components/demo/Shader/WireframeCube';
import LaserCutShaderComponent from '@/components/demo/Shader/LaserCut';
import TwistedBox from '@/components/demo/Shader/TwistedBox';
import BackgroundShaderComponent from '@/components/demo/Shader/BackgroundShader';
export default function EffectPage() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  return (
    <ContentLayout title="Effect(3D/Shader)">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Effect(3D/Shader)</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MotionWrapper>
        <div className="mt-4 grid min-h-[calc(100vh-200px)] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LaserCutShaderComponent />
          <WireframeCubeShaderComponent />
          <LaserBorderShaderComponent />
          <LaserLoadingShaderComponent />
          <DynamicImageTransition />
          <TwistedBox />
          <GradientBackground />
          <FlowerShaderComponent />
          <CursorBall />
          {/* <BackgroundShaderComponent /> */}
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
