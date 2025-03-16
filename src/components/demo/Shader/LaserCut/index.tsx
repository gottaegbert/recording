'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import {
  useShaderHotReload,
  triggerShaderReload,
} from '@/utils/shaderHotReload';
import { ShaderDevTools } from '../ShaderDevTools';
import { Button } from '@/components/ui/button';
import { FullscreenButton } from '../FullscreenButton';
import { ShaderCard, ShaderCanvas, ShaderControls } from '../ShaderStyles';

class LaserCutShader {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private startTime: number;
  private mouseX: number;
  private mouseY: number;
  private animationFrameId: number | null;

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
    this.mouseX = 0;
    this.mouseY = 0;
    this.animationFrameId = null;
  }

  initShader(
    canvas: HTMLCanvasElement,
    vertexSrc: string,
    fragmentSrc: string,
  ): void {
    this.canvas = canvas;
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

    const resolution = gl.getUniformLocation(program, 'iResolution');
    gl.uniform2f(resolution, canvas.width, canvas.height);

    const timeLocation = gl.getUniformLocation(program, 'iTime');
    if (timeLocation !== null && resolution !== null) {
      this.startTime = Date.now();
      this.render(timeLocation, resolution);
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

  updateMousePosition(x: number, y: number): void {
    if (!this.canvas) return;
    this.mouseX = x / this.canvas.width;
    this.mouseY = y / this.canvas.height;
  }

  resize(): void {
    if (!this.canvas || !this.gl) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
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

export default function LaserCutShaderComponent() {
  // Use shader hot reload hook instead of manual state
  const shaderVersion = useShaderHotReload();
  const shaderInstanceRef = useRef<LaserCutShader | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerId = 'laser-cut-container';
  const canvasId = 'laser-cut-canvas';

  // Initialize shader
  useEffect(() => {
    const canvas = document.getElementById(
      'laser-cut-canvas',
    ) as HTMLCanvasElement;
    canvasRef.current = canvas;

    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clean up previous shader instance if exists
      if (shaderInstanceRef.current) {
        shaderInstanceRef.current.cleanup();
      }

      const laserCutShader = new LaserCutShader();
      shaderInstanceRef.current = laserCutShader;

      try {
        laserCutShader.initShader(
          canvas,
          vertexShaderSource,
          fragmentShaderSource,
        );
        console.log('✅ Shader initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize shader:', error);
      }

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        laserCutShader.updateMousePosition(x, y);
      };

      const handleResize = () => {
        laserCutShader.resize();
      };

      window.addEventListener('resize', handleResize);
      canvas.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', handleMouseMove);
        laserCutShader.cleanup();
      };
    }
  }, [shaderVersion]); // Re-initialize when shader version changes

  // Helper to open the shader file in editor
  const openShaderInEditor = () => {
    // This uses the Cursor built-in capabilities if available
    // Or falls back to a console message
    if (typeof window !== 'undefined') {
      if (
        'cursor' in window &&
        typeof (window as any).cursor?.openFile === 'function'
      ) {
        (window as any).cursor.openFile(
          './src/components/demo/Shader/LaserCut/shaders.ts',
        );
      } else {
        console.log(
          '📂 To edit the shader, open: src/components/demo/Shader/LaserCut/shaders.ts',
        );
      }
    }
  };

  return (
    <ShaderCard id={containerId}>
      <ShaderCanvas id={canvasId} />

      <ShaderControls>
        <FullscreenButton targetId={containerId} />
      </ShaderControls>

      <ShaderDevTools
        position="bottom-right"
        onOpenEditor={openShaderInEditor}
      />
    </ShaderCard>
  );
}
