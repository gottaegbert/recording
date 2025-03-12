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
// import ImageShaderComponent from '@/components/demo/Shader/DynamicImagetransition';
import LaserCutShaderComponent from '@/components/demo/Shader/LaserCut';
import WireframeCubeShaderComponent from '@/components/demo/Shader/WireframeCube';
import LaserBorderShaderComponent from '@/components/demo/Shader/LaserBorder';

export default function WorkingOnPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      transition={{
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        scale: { duration: 0.4 },
        x: { duration: 0.5 },
      }}
    >
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

        <div className="mt-4 grid min-h-[calc(100vh-200px)] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* <SideMenu />
          <ImageShaderComponent /> */}
          <LaserCutShaderComponent />
          <WireframeCubeShaderComponent />
          <LaserBorderShaderComponent />
        </div>
      </ContentLayout>
    </motion.div>
  );
}
