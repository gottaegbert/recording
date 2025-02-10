import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

class FlowerShader {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private startTime: number;

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
  }

  initShader(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    this.gl = gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vertexShader = this.createShader(
      gl.VERTEX_SHADER,
      `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,
    );

    const fragmentShader = this.createShader(
      gl.FRAGMENT_SHADER,
      `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec3 color = vec3(0.0);

          vec2 pos = vec2(0.5) - st;

          float r = length(pos) * 2.0;
          float a = atan(pos.y, pos.x);

          float f = abs(cos(a * (3.0 + sin(u_time) * 2.0)));
          f = abs(cos(a * (2.5 + sin(u_time) * 2.0))) * 0.5 + 0.3;

          color = vec3(1.0 - smoothstep(f, f + 0.02, r));
          gl_FragColor = vec4(color, 1.0);
      }
    `,
    );

    // 默认花的颜色

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

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolution, canvas.width, canvas.height);

    const mouse = gl.getUniformLocation(program, 'u_mouse');
    gl.uniform2f(mouse, 0.5, 0.5);
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    if (timeLocation !== null) {
      this.render(timeLocation);
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

  render(timeLocation: WebGLUniformLocation): void {
    if (!this.gl || !this.program) return;

    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const currentTime = (Date.now() - this.startTime) / 1000.0;
    this.gl.uniform1f(timeLocation, currentTime);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(() => this.render(timeLocation));
  }
}

export default function FlowerShaderComponent() {
  useEffect(() => {
    const canvas = document.getElementById(
      'circle-canvas',
    ) as HTMLCanvasElement;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const flowerShader = new FlowerShader();
      flowerShader.initShader(canvas);
    }
  }, []);

  return (
    <Card className="rounded-lg border-none mt-6 overflow-hidden">
      <CardContent className="p-0 relative w-full h-full">
        <canvas
          id="circle-canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </CardContent>
    </Card>
  );
}
