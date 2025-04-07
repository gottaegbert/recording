'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import { useShaderHotReload } from '@/utils/shaderHotReload';
import { ShaderDevTools } from '../ShaderDevTools';
import { FullscreenButton } from '../FullscreenButton';
import {
  ShaderCard,
  ShaderCanvas,
  ShaderControls,
  ShaderControlPanel,
} from '../ShaderStyles';

class LaserBorderShader {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private startTime: number;
  private animationFrameId: number | null;
  private speedFactor: number = 1.0;
  private colorCycle: boolean = true;

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
    this.animationFrameId = null;
  }

  initShader(
    canvas: HTMLCanvasElement,
    vertexSrc: string,
    fragmentSrc: string,
    options = { speedFactor: 1.0, colorCycle: true },
  ): void {
    this.canvas = canvas;
    this.speedFactor = options.speedFactor;
    this.colorCycle = options.colorCycle;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    this.gl = gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSrc);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    this.program = program;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Set resolution uniform
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Get time uniform location
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    if (timeLocation !== null && resolutionLocation !== null) {
      this.startTime = Date.now();
      this.render(timeLocation, resolutionLocation);
    }
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  render(
    timeLocation: WebGLUniformLocation,
    resolutionLocation: WebGLUniformLocation,
  ): void {
    if (!this.gl || !this.program || !this.canvas) return;

    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Update time uniform - apply speed factor
    const timeValue = this.colorCycle
      ? ((Date.now() - this.startTime) / 1000) * this.speedFactor
      : (((Date.now() - this.startTime) / 1000) * this.speedFactor) % 10.0; // 限制时间，防止颜色循环

    this.gl.uniform1f(timeLocation, timeValue);

    // Update resolution if canvas size changes
    this.gl.uniform2f(
      resolutionLocation,
      this.canvas.width,
      this.canvas.height,
    );

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.animationFrameId = requestAnimationFrame(() =>
      this.render(timeLocation, resolutionLocation),
    );
  }

  updateSettings(options: { speedFactor?: number; colorCycle?: boolean }) {
    if (options.speedFactor !== undefined) {
      this.speedFactor = options.speedFactor;
    }
    if (options.colorCycle !== undefined) {
      this.colorCycle = options.colorCycle;
    }
  }

  resize(): void {
    if (!this.canvas || !this.gl || !this.program) return;

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Update resolution uniform
    const resolutionLocation = this.gl.getUniformLocation(
      this.program,
      'iResolution',
    );
    if (resolutionLocation) {
      this.gl.uniform2f(
        resolutionLocation,
        this.canvas.width,
        this.canvas.height,
      );
    }
  }

  cleanup(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}

interface LaserBorderShaderProps {
  className?: string;
}

export default function LaserBorderShaderComponent({
  className,
}: LaserBorderShaderProps) {
  const shaderVersion = useShaderHotReload();
  const shaderInstanceRef = useRef<LaserBorderShader | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speedFactor, setSpeedFactor] = useState(1.0);
  const [colorCycle, setColorCycle] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const containerId = 'laser-border-container';

  // 调整速度的函数
  const adjustSpeed = (amount: number) => {
    setSpeedFactor((prev) => {
      const newValue = Math.max(0.1, Math.min(3.0, prev + amount));
      return parseFloat(newValue.toFixed(1));
    });
  };

  useEffect(() => {
    const canvas = document.getElementById(
      'laser-border-canvas',
    ) as HTMLCanvasElement;
    canvasRef.current = canvas;

    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clean up previous shader instance if exists
      if (shaderInstanceRef.current) {
        shaderInstanceRef.current.cleanup();
      }

      const laserBorderShader = new LaserBorderShader();
      shaderInstanceRef.current = laserBorderShader;

      try {
        laserBorderShader.initShader(
          canvas,
          vertexShaderSource,
          fragmentShaderSource,
          { speedFactor, colorCycle },
        );
        console.log('✅ Laser border shader initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize laser border shader:', error);
      }

      const handleResize = () => {
        laserBorderShader.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        laserBorderShader.cleanup();
      };
    }
  }, [shaderVersion, speedFactor, colorCycle]); // Re-initialize when shader version or settings change

  // Update shader settings without recreating
  useEffect(() => {
    if (shaderInstanceRef.current) {
      shaderInstanceRef.current.updateSettings({ speedFactor, colorCycle });
    }
  }, [speedFactor, colorCycle]);

  // Helper to open the shader file in editor
  const openShaderInEditor = () => {
    if (typeof window !== 'undefined') {
      if (
        'cursor' in window &&
        typeof (window as any).cursor?.openFile === 'function'
      ) {
        (window as any).cursor.openFile(
          './src/components/demo/Shader/LaserBorder/shaders.ts',
        );
      } else {
        console.log(
          '📂 To edit the shader, open: src/components/demo/Shader/LaserBorder/shaders.ts',
        );
      }
    }
  };

  return (
    <ShaderCard id={containerId} className={className}>
      <ShaderCanvas id="laser-border-canvas" background="rgba(0, 0, 0, 0.9)" />

      <ShaderControls>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? 'Hide Control' : 'Show Control'}
        </Button>
        <FullscreenButton targetId={containerId} />
      </ShaderControls>

      <ShaderControlPanel show={showControls}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>动画速度: {speedFactor.toFixed(1)}x</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustSpeed(-0.1)}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustSpeed(0.1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="color-cycle"
            checked={colorCycle}
            onCheckedChange={setColorCycle}
          />
          <Label htmlFor="color-cycle">颜色循环</Label>
        </div>
      </ShaderControlPanel>

      <ShaderDevTools
        position="bottom-right"
        onOpenEditor={openShaderInEditor}
      />
    </ShaderCard>
  );
}
