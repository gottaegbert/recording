'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
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

class BackgroundShader {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private startTime: number = Date.now();
  private animationFrameId: number | null = null;
  private isDark: boolean = false;
  private timeLocation: WebGLUniformLocation | null = null;
  private resolutionLocation: WebGLUniformLocation | null = null;
  private isDarkLocation: WebGLUniformLocation | null = null;
  private animationSpeed: number = 1.0;

  initShader(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    this.gl = gl;

    // Create shaders
    const vertexShader = this.createShader(
      gl.VERTEX_SHADER,
      vertexShaderSource,
    );
    const fragmentShader = this.createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    this.program = program;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up position attribute
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    this.timeLocation = gl.getUniformLocation(program, 'iTime');
    this.resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    this.isDarkLocation = gl.getUniformLocation(program, 'isDark');

    this.render();
  }

  setTheme(isDark: boolean) {
    this.isDark = isDark;
    if (this.gl && this.program && this.isDarkLocation) {
      this.gl.useProgram(this.program);
      this.gl.uniform1f(this.isDarkLocation, isDark ? 1.0 : 0.0);
    }
  }

  setAnimationSpeed(speed: number) {
    this.animationSpeed = speed;
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

  render = () => {
    if (!this.gl || !this.program || !this.canvas) return;

    // Update canvas size
    const canvas = this.canvas;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // Set uniforms
    if (this.timeLocation) {
      this.gl.uniform1f(
        this.timeLocation,
        (Date.now() - this.startTime) * 0.001 * this.animationSpeed,
      );
    }

    if (this.resolutionLocation) {
      this.gl.uniform2f(this.resolutionLocation, canvas.width, canvas.height);
    }

    if (this.isDarkLocation) {
      this.gl.uniform1f(this.isDarkLocation, this.isDark ? 1.0 : 0.0);
    }

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.render);
  };

  resize() {
    if (!this.canvas || !this.gl) return;

    const canvas = this.canvas;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      this.gl.viewport(0, 0, canvas.width, canvas.height);

      if (this.resolutionLocation && this.program) {
        this.gl.useProgram(this.program);
        this.gl.uniform2f(this.resolutionLocation, canvas.width, canvas.height);
      }
    }
  }

  cleanup() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}

interface BackgroundShaderProps {
  className?: string;
}

export default function BackgroundShaderComponent({
  className,
}: BackgroundShaderProps) {
  const shaderVersion = useShaderHotReload();
  const shaderRef = useRef<BackgroundShader | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, setTheme } = useTheme();
  const [speedFactor, setSpeedFactor] = useState(1.0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const containerId = 'background-shader-container';
  const canvasId = 'background-shader-canvas';

  // Adjust animation speed
  const adjustSpeed = (delta: number) => {
    setSpeedFactor((prev) => {
      const newSpeed = Math.max(0.1, Math.min(3.0, prev + delta));
      if (shaderRef.current) {
        shaderRef.current.setAnimationSpeed(newSpeed);
      }
      return Number(newSpeed.toFixed(1));
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvasRef.current = canvas;

    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clean up previous shader instance if exists
      if (shaderRef.current) {
        shaderRef.current.cleanup();
      }

      const shader = new BackgroundShader();
      shaderRef.current = shader;

      try {
        shader.initShader(canvas);
        shader.setTheme(theme === 'dark');
        shader.setAnimationSpeed(speedFactor);
        console.log('✅ Background shader initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize background shader:', error);
      }

      const handleResize = () => {
        shader.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        shader.cleanup();
      };
    }
  }, [shaderVersion, theme, speedFactor]);

  // Update theme when it changes
  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.setTheme(theme === 'dark');
    }
  }, [theme]);

  // Update animation state
  useEffect(() => {
    if (shaderRef.current && !isAnimating) {
      shaderRef.current.cleanup();
    } else if (shaderRef.current && isAnimating && canvasRef.current) {
      shaderRef.current.initShader(canvasRef.current);
      shaderRef.current.setTheme(theme === 'dark');
      shaderRef.current.setAnimationSpeed(speedFactor);
    }
  }, [isAnimating, theme, speedFactor]);

  // Helper to open the shader file in editor
  const openShaderInEditor = () => {
    if (typeof window !== 'undefined') {
      if (
        'cursor' in window &&
        typeof (window as any).cursor?.openFile === 'function'
      ) {
        (window as any).cursor.openFile(
          './src/components/demo/Shader/BackgroundShader/shaders.ts',
        );
      } else {
        console.log(
          '📂 To edit the shader, open: src/components/demo/Shader/BackgroundShader/shaders.ts',
        );
      }
    }
  };

  return (
    <ShaderCard id={containerId} className={className}>
      <ShaderCanvas id={canvasId} background="rgba(0, 0, 0, 0.8)" />

      <ShaderControls>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? 'Hide Control' : 'Show Control'}
        </Button>
        <Button onClick={toggleTheme} variant="default" size="sm">
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <FullscreenButton targetId={containerId} />
      </ShaderControls>

      <ShaderControlPanel show={showControls}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Animation Speed: {speedFactor.toFixed(1)}x</Label>
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

        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id="animation-toggle"
            checked={isAnimating}
            onCheckedChange={setIsAnimating}
          />
          <Label htmlFor="animation-toggle">Animation</Label>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id="theme-toggle"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
          <Label htmlFor="theme-toggle">Dark Mode</Label>
        </div>
      </ShaderControlPanel>

      <ShaderDevTools
        position="bottom-right"
        onOpenEditor={openShaderInEditor}
      />
    </ShaderCard>
  );
}
