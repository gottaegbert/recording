'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';

export default function MondrianMacPage() {
  return (
    <MotionWrapper>
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">Mondrian&apos;s Mac</h1>
        <Card className="overflow-hidden">
          <iframe
            src="https://gottaegbert.github.io/Mondrian-s-Mac/"
            className="h-[calc(100vh-200px)] w-full border-0"
            title="Mondrian's Mac"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </Card>
      </div>
    </MotionWrapper>
  );
}
