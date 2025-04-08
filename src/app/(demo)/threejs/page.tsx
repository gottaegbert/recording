'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import MetallicMaterialsDemo from './components/metalness';
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
export default function ThreejsPage() {
  return (
    <MotionWrapper>
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
              <BreadcrumbPage>Three.js</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container mx-auto p-6">
          <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <MetallicMaterialsDemo />
          </Card>
        </div>
      </ContentLayout>
    </MotionWrapper>
  );
}
