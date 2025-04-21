'use client';
//problem
import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import { ShaderCard } from '../ShaderStyles';

class BackgroundShader {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private startTime: number = Date.now();
  private animationFrameId: number | null = null;
  private isDark: boolean = false;

  initShader(canvas: HTMLCanvasElement) {
    if (!canvas) {
      console.error('Canvas element is not available');
      return;
    }

    const gl = canvas.getContext('webgl', {
      antialias: true,
    });
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

    this.render();
  }

  setTheme(isDark: boolean) {
    this.isDark = isDark;
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
    if (!this.gl || !this.program) return;

    // Update canvas size
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // Set uniforms
    const timeLocation = this.gl.getUniformLocation(this.program, 'iTime');
    const resolutionLocation = this.gl.getUniformLocation(
      this.program,
      'iResolution',
    );
    const isDarkLocation = this.gl.getUniformLocation(this.program, 'isDark');

    this.gl.uniform1f(timeLocation, (Date.now() - this.startTime) * 0.001);
    this.gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    this.gl.uniform1f(isDarkLocation, this.isDark ? 1.0 : 0.0);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.render);
  };

  cleanup() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

export default function BackgroundShaderComponent() {
  const shaderRef = useRef<BackgroundShader | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = document.getElementById(
      'background-shader',
    ) as HTMLCanvasElement;
    if (canvas) {
      const shader = new BackgroundShader();
      shaderRef.current = shader;
      shader.initShader(canvas);

      return () => {
        shader.cleanup();
      };
    }
  }, []);

  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.setTheme(theme === 'dark');
    }
  }, [theme]);

  return (
    <ShaderCard id="background-shader">
      <canvas
        id="background-shader"
        className="fixed inset-0 -z-10 h-screen w-screen"
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',

          // zIndex: -1,
        }}
      />
    </ShaderCard>
  );
}
