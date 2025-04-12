'use client';

import { useEffect, useRef, useState } from 'react';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import { useShaderHotReload } from '@/utils/shaderHotReload';
import { ShaderDevTools } from '../ShaderDevTools';
import { Button } from '@/components/ui/button';
import { FullscreenButton } from '../FullscreenButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  ShaderCard,
  ShaderCanvas,
  ShaderControls,
  ShaderControlPanel,
} from '../ShaderStyles';

class WireframeCubeShader {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private startTime: number;
  private animationFrameId: number | null;
  private expandLocation: WebGLUniformLocation | null;
  private expandValue: number;

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
    this.animationFrameId = null;
    this.expandLocation = null;
    this.expandValue = 0; // 默认为折叠状态
  }

  initShader(
    canvas: HTMLCanvasElement,
    vertexSrc: string,
    fragmentSrc: string,
    initialExpand: number = 0,
  ): void {
    this.canvas = canvas;
    this.expandValue = initialExpand;

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

    // Get expand uniform location
    this.expandLocation = gl.getUniformLocation(program, 'uExpand');
    gl.uniform1f(this.expandLocation, this.expandValue);

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

    // Update time uniform
    const currentTime = (Date.now() - this.startTime) / 1000;
    this.gl.uniform1f(timeLocation, currentTime);

    // Update expansion value
    if (this.expandLocation !== null) {
      this.gl.uniform1f(this.expandLocation, this.expandValue);
    }

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

  // 更新展开值（0-1之间）
  updateExpand(value: number): void {
    this.expandValue = Math.max(0, Math.min(1, value)); // 确保在0-1范围内
    if (this.gl && this.program && this.expandLocation !== null) {
      this.gl.useProgram(this.program);
      this.gl.uniform1f(this.expandLocation, this.expandValue);
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

interface WireframeCubeShaderProps {
  className?: string;
}

export default function WireframeCubeShaderComponent({
  className,
}: WireframeCubeShaderProps) {
  const shaderVersion = useShaderHotReload();
  const shaderInstanceRef = useRef<WireframeCubeShader | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandValue, setExpandValue] = useState(0);
  const expandAnimationRef = useRef<number | null>(null);
  const [speedFactor, setSpeedFactor] = useState(1.0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const containerId = 'wireframe-cube-container';
  const canvasId = 'wireframe-cube-canvas';

  // 调整动画速度
  const adjustSpeed = (delta: number) => {
    setSpeedFactor((prev) => {
      const newSpeed = Math.max(0.1, Math.min(3.0, prev + delta));
      return Number(newSpeed.toFixed(1));
    });
  };

  // 处理动画过渡
  useEffect(() => {
    // 清除之前的动画
    if (expandAnimationRef.current !== null) {
      cancelAnimationFrame(expandAnimationRef.current);
    }

    const targetValue = isExpanded ? 1 : 0;
    const startValue = expandValue;
    const startTime = Date.now();
    const duration = 1000; // 动画持续时间（毫秒）

    // 动画函数
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用easeInOutCubic缓动函数使动画更自然
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const newValue =
        startValue + (targetValue - startValue) * easeInOutCubic(progress);
      setExpandValue(newValue);

      // 更新shader中的展开值
      if (shaderInstanceRef.current) {
        shaderInstanceRef.current.updateExpand(newValue);
      }

      if (progress < 1) {
        expandAnimationRef.current = requestAnimationFrame(animate);
      } else {
        expandAnimationRef.current = null;
      }
    };

    expandAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (expandAnimationRef.current !== null) {
        cancelAnimationFrame(expandAnimationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvasRef.current = canvas;

    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clean up previous shader instance if exists
      if (shaderInstanceRef.current) {
        shaderInstanceRef.current.cleanup();
      }

      const wireframeCubeShader = new WireframeCubeShader();
      shaderInstanceRef.current = wireframeCubeShader;

      try {
        wireframeCubeShader.initShader(
          canvas,
          vertexShaderSource,
          fragmentShaderSource,
          expandValue,
        );
        console.log('✅ Wireframe cube shader initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize wireframe cube shader:', error);
      }

      const handleResize = () => {
        wireframeCubeShader.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        wireframeCubeShader.cleanup();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shaderVersion]); // Re-initialize when shader version changes

  // 切换展开/折叠状态
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper to open the shader file in editor
  const openShaderInEditor = () => {
    if (typeof window !== 'undefined') {
      if (
        'cursor' in window &&
        typeof (window as any).cursor?.openFile === 'function'
      ) {
        (window as any).cursor.openFile(
          './src/components/demo/Shader/WireframeCube/shaders.ts',
        );
      } else {
        console.log(
          '📂 To edit the shader, open: src/components/demo/Shader/WireframeCube/shaders.ts',
        );
      }
    }
  };

  return (
    <ShaderCard id={containerId} className={className}>
      <ShaderCanvas id={canvasId} />

      <ShaderControls>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? 'Hide Control' : 'Show Control'}
        </Button>
        <Button onClick={toggleExpand} variant="default" size="sm">
          {isExpanded ? 'Collapse' : 'Expand'}
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
            id="animation-toggle"
            checked={isAnimating}
            onCheckedChange={setIsAnimating}
          />
          <Label htmlFor="animation-toggle">动画开关</Label>
        </div>
      </ShaderControlPanel>

      <ShaderDevTools
        position="bottom-right"
        onOpenEditor={openShaderInEditor}
      />
    </ShaderCard>
  );
}
