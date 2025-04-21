'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';

export default function MondrianMacPage() {
  return (
    <MotionWrapper>
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">Mondrian&apos;s Mac</h1>
        <Card className="relative overflow-hidden">
          <FullscreenButton
            targetId="mondrian-iframe"
            className="absolute right-2 top-2 z-10 flex items-center space-x-1 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
          />
          <iframe
            id="mondrian-iframe"
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
