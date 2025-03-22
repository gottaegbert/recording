'use client';

import { useEffect, useRef } from 'react';
import { Gradient } from './Bkground.js'; // 确保这个路径正确
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { defaultGradientConfig, GradientConfig } from './config';
import { useShaderHotReload } from '@/utils/shaderHotReload';
import { ShaderDevTools } from '../ShaderDevTools';

interface GradientBackgroundProps {
  tint?: string;
  config?: Partial<GradientConfig>;
}

export default function GradientBackground({
  tint,
  config,
}: GradientBackgroundProps) {
  const shaderVersion = useShaderHotReload();
  const gradientRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Merge default config with props config
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gradientConfig = {
    ...defaultGradientConfig,
    ...(config || {}),
  };

  useEffect(() => {
    const canvas = document.getElementById(
      'gradient-canvas',
    ) as HTMLCanvasElement;
    canvasRef.current = canvas;

    if (canvas) {
      // Cleanup previous gradient instance if it exists
      if (gradientRef.current) {
        try {
          gradientRef.current.disconnect();
        } catch (error) {
          console.warn('Error cleaning up previous gradient:', error);
        }
      }

      try {
        // Create new gradient instance
        const gradient = new Gradient();
        gradientRef.current = gradient;

        // Initialize with custom config
        gradient.initGradient('#gradient-canvas');

        // Apply custom amplitude and frequency if provided
        if (gradientConfig.amplitude) {
          // @ts-ignore - amp exists in Gradient class but is not typed
          gradient.amp = gradientConfig.amplitude;
        }

        if (gradientConfig.frequency) {
          gradient.updateFrequency(gradientConfig.frequency);
        }

        console.log('✅ Gradient initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize gradient:', error);
      }
    }

    return () => {
      if (gradientRef.current) {
        try {
          gradientRef.current.disconnect();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      }
    };
  }, [shaderVersion, gradientConfig]);

  // Helper to open the config file in editor
  const openConfigInEditor = () => {
    if (typeof window !== 'undefined') {
      if (
        'cursor' in window &&
        typeof (window as any).cursor?.openFile === 'function'
      ) {
        (window as any).cursor.openFile(
          './src/components/demo/Shader/GradientBackground/config.ts',
        );
      } else {
        console.log(
          '📂 To edit the gradient config, open: src/components/demo/Shader/GradientBackground/config.ts',
        );
      }
    }
  };

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
              '--gradient-color-1': gradientConfig.colors.color1,
              '--gradient-color-2': gradientConfig.colors.color2,
              '--gradient-color-3': gradientConfig.colors.color3,
              '--gradient-color-4': gradientConfig.colors.color4,
            } as React.CSSProperties
          }
        />
        <ShaderDevTools
          position="bottom-right"
          onOpenEditor={openConfigInEditor}
        />
      </CardContent>
    </Card>
  );
}
