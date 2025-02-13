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
import CircleShaderComponent from '@/components/demo/Shader/CircleShader';
import FlowerShaderComponent from '@/components/demo/Shader/Flower';
export default function EffectPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;
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

      <div className="mt-4 grid min-h-[calc(100vh-200px)] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CursorBall />
        <FlowerShaderComponent />
        <GradientBackground />
        <CircleShaderComponent />
      </div>
    </ContentLayout>
  );
}
