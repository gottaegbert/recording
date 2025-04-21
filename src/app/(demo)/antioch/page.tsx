'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';
import { FullscreenButton } from '@/components/demo/Shader/FullscreenButton';
export default function AntiochPage() {
  return (
    <MotionWrapper>
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">Antioch</h1>
        <Card className="relative overflow-hidden">
          <FullscreenButton
            targetId="antioch-iframe"
            className="absolute right-2 top-2 z-10 flex items-center space-x-1 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
          />

          <iframe
            id="antioch-iframe"
            src="https://antioch.vercel.app/"
            className="h-[calc(100vh-200px)] w-full border-0"
            title="Antioch"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </Card>
      </div>
    </MotionWrapper>
  );
}
