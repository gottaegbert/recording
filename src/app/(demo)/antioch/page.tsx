'use client';

import { Card } from '@/components/ui/card';
import MotionWrapper from '@/components/transition/motion-wrapper';

export default function AntiochPage() {
  return (
    <MotionWrapper>
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">Antioch</h1>
        <Card className="overflow-hidden">
          <iframe
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
