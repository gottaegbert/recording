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
import Simulation from './simulation';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';

export default function SimulationPage() {
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
            <FullscreenButton
              targetId="simulation-container"
              className="absolute right-2 top-2 z-10 flex items-center space-x-1 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
            />
            <div
              className="h-full w-full"
              style={{ position: 'absolute', inset: 0 }}
            >
              <Simulation />
            </div>
          </Card>
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
