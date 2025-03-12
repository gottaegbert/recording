'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

class LaserCutShader {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private startTime: number;
  private mouseX: number;
  private mouseY: number;

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
    this.mouseX = 0;
    this.mouseY = 0;
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

      uniform vec2 iResolution;
      uniform float iTime;

      // rand [0,1] https://www.shadertoy.com/view/4djSRW
      float rand(vec2 p) {
          p *= 500.0;
          vec3 p3  = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      // value noise
      float noise(vec2 p) {
          vec2 f = smoothstep(0.0, 1.0, fract(p));
          vec2 i = floor(p);
          float a = rand(i);
          float b = rand(i+vec2(1.0,0.0));
          float c = rand(i+vec2(0.0,1.0));
          float d = rand(i+vec2(1.0,1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // fractal noise
      float fbm(vec2 p) {
          float a = 0.5;
          float r = 0.0;
          for (int i = 0; i < 8; i++) {
              r += a*noise(p);
              a *= 0.5;
              p *= 2.0;
          }
          return r;
      }

      // lasers originating from a central point
      float laser(vec2 p, int num) {
          float r = atan(p.x, p.y);
          float sn = sin(r*float(num)+iTime);
          float lzr = 0.5+0.5*sn;
          lzr = lzr*lzr*lzr*lzr*lzr;
          float glow = pow(clamp(sn, 0.0, 1.0),100.0);
          return lzr+glow;
      }

      // mix of fractal noises to simulate fog
      float clouds(vec2 uv) {
          vec2 t = vec2(0,iTime);
          float c1 = fbm(fbm(uv*3.0)*0.75+uv*3.0+t/3.0);
          float c2 = fbm(fbm(uv*2.0)*0.5+uv*7.0+t/3.0);
          float c3 = fbm(fbm(uv*10.0-t)*0.75+uv*5.0+t/6.0);
          float r = mix(c1, c2, c3*c3);
          return r*r;
      }

      void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          vec2 uv = fragCoord/iResolution.y;
          vec2 hs = iResolution.xy/iResolution.y*0.5;
          vec2 uvc = uv-hs;
          float l = (1.0 + 3.0*noise(vec2(15.0-iTime)))
              * laser(vec2(uv.x+0.5, uv.y*(0.5 + 10.0*noise(vec2(iTime/5.0))) + 0.1), 15);
          l += fbm(vec2(2.0*iTime))
              * laser(vec2(hs.x-uvc.x-0.2, uv.y+0.1), 25);
          l += noise(vec2(iTime-73.0))
              * laser(vec2(uvc.x, 1.0-uv.y+0.5), 30);
          float c = clouds(uv);
          vec4 col = vec4(0, 1, 0, 1)*(uv.y*l+uv.y*uv.y)*c;
          gl_FragColor = pow(col, vec4(0.75));
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

    requestAnimationFrame(() => this.render(timeLocation, resolutionLocation));
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
}

export default function LaserCutShaderComponent() {
  useEffect(() => {
    const canvas = document.getElementById(
      'laser-cut-canvas',
    ) as HTMLCanvasElement;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const laserCutShader = new LaserCutShader();
      laserCutShader.initShader(canvas);

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
      };
    }
  }, []);

  return (
    <Card className="mt-6 overflow-hidden rounded-lg border-none">
      <CardContent className="relative h-full w-full p-0">
        <canvas
          id="laser-cut-canvas"
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
