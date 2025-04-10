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

import MotionStagger from '@/components/demo/MotionStagger';
import MotionList from '@/components/demo/MotionList';
import MotionDrag from '@/components/demo/MotionDrag';
import MotionNumber from '@/components/demo/MotionNumber';
import MotionImageEntrance from '@/components/demo/MotionImageEntrance';
import ToolbarSwitch from '@/components/demo/ToolbarSwitch';
import SideMenu from '@/components/demo/SideMenu';
import MotionWrapper from '@/components/transition/motion-wrapper';

export default function MotionPage() {
  return (
    <ContentLayout title="Motion">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Motion</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MotionWrapper>
        <div className="mt-4 grid min-h-[calc(100vh-200px)] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SideMenu />
          <ToolbarSwitch />
          <MotionList />
          <MotionStagger />
          <MotionDrag />
          <MotionNumber />
          <MotionImageEntrance />
        </div>
      </MotionWrapper>
    </ContentLayout>
  );
}
