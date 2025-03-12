export const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform float iTime;
  
  // 噪声函数替代 iChannel0 纹理
  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // 二维噪声
  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
  }
  
  vec4 generateNoise(vec2 uv) {
    float n1 = noise(uv * 10.0 + iTime / 10.0);
    float n2 = noise(uv * 15.0 - iTime / 12.0);
    float n3 = noise(uv * 5.0 + iTime / 8.0);
    return vec4(n1, n2, n3, 1.0);
  }
  
  // HSL to RGB conversion
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }
  
  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 c2 = generateNoise(uv);
    
    // 动态边框位置 - 略微呼吸效果
    float breathe = sin(iTime * 0.8) * 0.02 + 1.0;
    vec2 p1 = vec2(0.4 - breathe * 0.03, 0.2 - breathe * 0.02);
    vec2 p2 = vec2(0.6 + breathe * 0.03, 0.8 + breathe * 0.02);
    vec2 p3 = vec2(0.4 - breathe * 0.03, 0.8 + breathe * 0.02);
    vec2 p4 = vec2(0.6 + breathe * 0.03, 0.2 - breathe * 0.02);

    float d1 = step(p1.x, uv.x) * step(uv.x, p4.x) * abs(uv.y - p1.y) +
        step(uv.x, p1.x) * distance(uv, p1) + step(p4.x, uv.x) * distance(uv, p4);
    d1 = min(step(p3.x, uv.x) * step(uv.x, p2.x) * abs(uv.y - p2.y) +
        step(uv.x, p3.x) * distance(uv, p3) + step(p2.x, uv.x) * distance(uv, p2), d1);
    d1 = min(step(p1.y, uv.y) * step(uv.y, p3.y) * abs(uv.x - p1.x) +
        step(uv.y, p1.y) * distance(uv, p1) + step(p3.y, uv.y) * distance(uv, p3), d1);
    d1 = min(step(p4.y, uv.y) * step(uv.y, p2.y) * abs(uv.x - p2.x) +
        step(uv.y, p4.y) * distance(uv, p4) + step(p2.y, uv.y) * distance(uv, p2), d1);
    
    // 动态边框宽度
    float borderPulse = 0.01 + sin(iTime * 2.0) * 0.003;
    float f1 = borderPulse / abs(d1 + c2.r / 80.0 + sin(iTime * 3.0 + uv.x * 10.0) * 0.01);
    
    // 颜色随时间变化
    float hue = mod(iTime * 0.1, 1.0); // 色相循环
    float sat = 0.8; // 饱和度
    float light = 0.5; // 亮度
    vec3 baseColor = hsl2rgb(vec3(hue, sat, light));
    
    // 加入边缘流动效果
    float flow = sin(iTime * 5.0 + uv.x * 20.0 + uv.y * 20.0) * 0.2 + 0.8;
    
    // 最终颜色输出
    vec3 finalColor = f1 * baseColor * flow;
    finalColor += vec3(f1 * 0.5); // 添加白色光晕
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Support for hot reload in development
declare global {
  interface Window {
    __LASER_BORDER_VERSION__?: number;
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initialize or increment the shader version counter
  window.__LASER_BORDER_VERSION__ = (window.__LASER_BORDER_VERSION__ || 0) + 1;
  const currentVersion = window.__LASER_BORDER_VERSION__;

  // Use setTimeout to ensure this runs after the module is fully loaded
  setTimeout(() => {
    // Only trigger if this is a hot reload (version > 1)
    if (currentVersion > 1) {
      console.log(
        '🔄 Laser border shader code updated (v' +
          currentVersion +
          '), triggering reload...',
      );
      window.dispatchEvent(new Event('shader-reload'));
    }
  }, 0);
}
