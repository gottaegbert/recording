export const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
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
      vec4 col = vec4(0.1, 0.4, 1, 2)*(uv.y*l+uv.y*uv.y)*c;
      gl_FragColor = pow(col, vec4(0.75));
  }
`;

// Support for hot reload in development
declare global {
  interface Window {
    __SHADER_VERSION__?: number;
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initialize or increment the shader version counter
  window.__SHADER_VERSION__ = (window.__SHADER_VERSION__ || 0) + 1;
  const currentVersion = window.__SHADER_VERSION__;

  // Use setTimeout to ensure this runs after the module is fully loaded
  setTimeout(() => {
    // Only trigger if this is a hot reload (version > 1)
    if (currentVersion > 1) {
      console.log(
        '🔄 Shader code updated (v' +
          currentVersion +
          '), triggering reload...',
      );
      window.dispatchEvent(new Event('shader-reload'));
    }
  }, 0);
}
