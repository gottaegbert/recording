import { useEffect } from 'react';
import { Gradient } from './Bkground.js'; // 确保这个路径正确
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';

interface GradientBackgroundProps {
  tint?: string;
}

export default function GradientBackground({ tint }: GradientBackgroundProps) {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  return (
    <Card className="mt-6 overflow-hidden rounded-lg border-none">
      <CardContent className="relative h-full p-0">
        {/* 固定高度并添加 overflow-hidden */}
        <canvas
          id="gradient-canvas"
          data-transition-in
          style={
            {
              position: 'absolute', // 改为 absolute
              top: 0,
              left: 0,
              width: '100%', // 改为百分比
              height: '100%', // 改为百分比
              '--gradient-color-1': '#071933',
              '--gradient-color-2': '#05A3AF',
              '--gradient-color-3': '#4C4489',
              '--gradient-color-4': '#122F5C',
            } as React.CSSProperties
          }
        />
      </CardContent>
    </Card>
  );
}
