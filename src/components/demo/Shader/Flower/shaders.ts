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
        '🔄 Flower shader code updated (v' +
          currentVersion +
          '), triggering reload...',
      );
      window.dispatchEvent(new Event('shader-reload'));
    }
  }, 0);
}
