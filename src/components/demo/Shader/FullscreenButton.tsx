'use client';

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
  const toggleFullscreen = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
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
