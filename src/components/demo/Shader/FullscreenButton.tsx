'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenButtonProps {
  targetId: string;
  className?: string;
}

export function FullscreenButton({
  targetId,
  className,
}: FullscreenButtonProps) {
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

  const toggleFullscreen = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
        // 进入全屏后立即触发一次 resize 事件
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      } else {
        await document.exitFullscreen();
        // 退出全屏后立即触发一次 resize 事件
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className={className}
      onClick={toggleFullscreen}
    >
      <Maximize2 className="fullscreen-show h-4 w-4" />
      <Minimize2 className="fullscreen-hide h-4 w-4" />
      <style jsx global>{`
        .fullscreen-hide {
          display: none;
        }
        :fullscreen .fullscreen-show {
          display: none;
        }
        :fullscreen .fullscreen-hide {
          display: block;
        }
      `}</style>
    </Button>
  );
}
