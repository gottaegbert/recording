'use client';
import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

class ImageRevealShader {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  async initShader(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    this.gl = gl;

    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexShader = this.createShader(
      gl.VERTEX_SHADER,
      `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vUv = uv;
      }
    `,
    );

    const fragmentShader = this.createShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uProgress;
      uniform vec2 uSize;
      #define PI 3.1415926538

      float noise(vec2 point) {
        float frequency = 1.0;
        float angle = atan(point.y, point.x) + uProgress * PI;
        
        float w0 = (cos(angle * frequency) + 1.0) / 2.0;
        float w1 = (sin(2.0 * angle * frequency) + 1.0) / 2.0;
        float w2 = (cos(3.0 * angle * frequency) + 1.0) / 2.0;
        return (w0 + w1 + w2) / 3.0;
      }

      float softMax(float a, float b, float k) {
        return log(exp(k * a) + exp(k * b)) / k;
      }

      float softMin(float a, float b, float k) {
        return -softMax(-a, -b, k);
      }

      float circleSDF(vec2 pos, float rad) {
        float a = sin(uProgress * 0.2) * 0.25;
        float amt = 0.5 + a;
        float circle = length(pos);
        circle += noise(pos) * rad * amt;
        return circle;
      }

      float radialCircles(vec2 p, float o, float count) {
        vec2 offset = vec2(o, o);
        float angle = (2.0 * PI) / count;
        float s = floor(atan(p.y, p.x) / angle + 0.5);
        float an = angle * s;
        vec2 q = vec2(offset.x * cos(an), offset.y * sin(an));
        vec2 pos = p - q;
        float circle = circleSDF(pos, 15.0);
        return circle;
      }

      void main() {
        vec4 bg = vec4(vec3(0.0), 0.0);
        vec4 texture = texture2D(uTexture, vUv);
        vec2 coords = vUv * uSize;
        vec2 o1 = vec2(0.5) * uSize;

        float t = pow(uProgress, 2.5);
        float radius = uSize.x / 2.0;
        float rad = t * radius;
        float c1 = circleSDF(coords - o1, rad);

        vec2 p = (vUv - 0.5) * uSize;
        float r1 = radialCircles(p, 0.2 * uSize.x, 3.0);
        float r2 = radialCircles(p, 0.25 * uSize.x, 3.0);
        float r3 = radialCircles(p, 0.45 * uSize.x, 5.0);

        float k = 50.0 / uSize.x;
        float circle = softMin(c1, r1, k);
        circle = softMin(circle, r2, k);
        circle = softMin(circle, r3, k);

        circle = step(circle, rad);
        vec4 finalColor = mix(bg, texture, circle);
        gl_FragColor = finalColor;
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

    // 设置顶点和UV坐标
    const vertices = new Float32Array([
      -1,
      -1,
      0,
      1, // 位置和UV坐标
      1,
      -1,
      1,
      1,
      -1,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    const uvLoc = gl.getAttribLocation(program, 'uv');

    gl.enableVertexAttribArray(positionLoc);
    gl.enableVertexAttribArray(uvLoc);

    const size = 2;
    const stride = 4 * 4;
    gl.vertexAttribPointer(positionLoc, size, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(uvLoc, size, gl.FLOAT, false, stride, 2 * 4);

    // 加载纹理
    await this.loadTexture('./photo.jpeg');

    const resolution = gl.getUniformLocation(program, 'uSize');
    gl.uniform2f(resolution, canvas.width, canvas.height);
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

  private loadTexture(url: string): Promise<void> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        if (!this.gl || !this.program) return;

        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image,
        );

        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MIN_FILTER,
          this.gl.LINEAR,
        );
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MAG_FILTER,
          this.gl.LINEAR,
        );
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_S,
          this.gl.CLAMP_TO_EDGE,
        );
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_T,
          this.gl.CLAMP_TO_EDGE,
        );

        this.texture = texture;
        resolve();
      };
      image.src = url;
    });
  }

  render() {
    if (!this.gl || !this.program || !this.texture) return;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const progress = Math.min((Date.now() - this.startTime) / 2000, 1.0);

    // 设置 uniforms
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    const uTextureLocation = this.gl.getUniformLocation(
      this.program,
      'uTexture',
    );
    const uProgressLocation = this.gl.getUniformLocation(
      this.program,
      'uProgress',
    );
    const uSizeLocation = this.gl.getUniformLocation(this.program, 'uSize');

    this.gl.uniform1i(uTextureLocation, 0);
    this.gl.uniform1f(uProgressLocation, progress);
    this.gl.uniform2f(
      uSizeLocation,
      this.gl.canvas.width,
      this.gl.canvas.height,
    );

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    if (progress < 1.0) {
      requestAnimationFrame(() => this.render());
    }
  }

  // 添加重置方法
  reset() {
    this.startTime = Date.now();
    this.render();
  }
}

export default function ImageRevealComponent() {
  const shaderRef = useRef<ImageRevealShader | null>(null);

  useEffect(() => {
    const canvas = document.getElementById(
      'reveal-canvas',
    ) as HTMLCanvasElement;
    if (canvas) {
      const img = new Image();
      img.src = './photo.jpeg';

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const shader = new ImageRevealShader();
        shaderRef.current = shader;
        shader.initShader(canvas).then(() => shader.render());
      };
    }
  }, []);

  const handleReveal = () => {
    if (shaderRef.current) {
      shaderRef.current.reset();
    }
  };

  return (
    <Card className="mt-6 overflow-hidden rounded-lg border-none">
      <CardContent className="relative p-6">
        <div className="mb-4">
          <Button onClick={handleReveal} variant="outline" size="sm">
            Reveal Image
          </Button>
        </div>
        <canvas
          id="reveal-canvas"
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </CardContent>
    </Card>
  );
}
