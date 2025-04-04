'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ReactNode, useEffect } from 'react';

interface ShaderCardProps {
  id: string;
  className?: string;
  children: ReactNode;
  height?: string;
}

export function ShaderCard({
  id,
  className,
  children,
  height,
}: ShaderCardProps) {
  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      // 触发 resize 事件，让 shader 组件能够重新调整尺寸
      window.dispatchEvent(new Event('resize'));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card
      id={id}
      className={`relative mt-6 aspect-[9/16] overflow-hidden rounded-lg border-none ${className || ''}`}
      style={{
        aspectRatio: '9/16',
        height: height || 'auto',
      }}
    >
      <CardContent className="relative h-full w-full p-0">
        {children}
        <style jsx global>{`
          #${id}:fullscreen {
            width: 100vw !important;
            height: 100vh !important;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: auto !important;
            max-height: none !important;
          }
          #${id}:fullscreen canvas {
            width: 100vw !important;
            height: 100vh !important;
            object-fit: contain;
          }
        `}</style>
      </CardContent>
    </Card>
  );
}

export function ShaderCanvas({
  id,
  background = 'rgba(0, 0, 0, 0.9)',
}: {
  id: string;
  background?: string;
}) {
  return (
    <canvas
      id={id}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background,
        zIndex: 1,
      }}
    />
  );
}

export function ShaderControls({ children }: { children: ReactNode }) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
      {children}
    </div>
  );
}

export function ShaderControlPanel({
  children,
  show,
}: {
  children: ReactNode;
  show: boolean;
}) {
  if (!show) return null;

  return (
    <div className="absolute left-4 right-4 top-4 z-10 rounded-lg bg-black/70 p-4 backdrop-blur-sm">
      <div className="space-y-4">{children}</div>
    </div>
  );
}
