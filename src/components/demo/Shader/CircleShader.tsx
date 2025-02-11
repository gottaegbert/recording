import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

class CircleGradient {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private startTime: number;
  private timeLocation: WebGLUniformLocation | null;

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
    this.timeLocation = null;
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
      precision mediump float;
      uniform vec2 resolution;
      uniform vec3 color;
      uniform float time;
      
      float circle(in vec2 _st, in float _radius){
        vec2 dist = _st-vec2(0.5);
        return 1.-smoothstep(_radius-(_radius*0.03),
                           _radius+(_radius*0.01),
                           dot(dist,dist)*2.656*sin(time)*3.14);
      }
      
      void main() {
        vec2 st = gl_FragCoord.xy/resolution.xy;
        
        float pulse = 1.0 + sin(time * 3.0) * 0.1;
        float radius = 0.4 * pulse;
        
        float c = circle(st, radius);
        
        vec2 dist = st-vec2(0.5);
        float glow = exp(-dot(dist,dist) * 4.0) * 0.1;
        
        vec3 finalColor = color * (c + glow);
        float alpha = c + glow;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    );

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

    const resolution = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolution, canvas.width, canvas.height);

    const color = gl.getUniformLocation(program, 'color');
    gl.uniform3f(color, 0.3, 0.5, 0.8);

    this.timeLocation = gl.getUniformLocation(program, 'time');
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

  render(): void {
    if (!this.gl || !this.program) return;

    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const currentTime = (Date.now() - this.startTime) / 1000.0;
    this.gl.uniform1f(this.timeLocation, currentTime);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(() => this.render());
  }
}

interface CircleShaderProps {
  className?: string;
}

export default function CircleShaderComponent({
  className,
}: CircleShaderProps) {
  useEffect(() => {
    const canvas = document.getElementById(
      'circle-canvas',
    ) as HTMLCanvasElement;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const circle = new CircleGradient();
      circle.initShader(canvas);
      circle.render();
    }
  }, []);

  return (
    <Card className="mt-6 overflow-hidden rounded-lg border-none">
      <CardContent className="relative h-full w-full p-0">
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
