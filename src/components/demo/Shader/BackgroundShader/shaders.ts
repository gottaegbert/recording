export const vertexShaderSource = `
  // 顶点着色器：定义顶点位置
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
  // 设置浮点数精度
  precision mediump float;
  
  // 输入变量
  uniform vec2 iResolution;  // 屏幕分辨率
  uniform float iTime;       // 时间（秒）
  uniform float isDark;      // 主题模式（0.0为亮色，1.0为暗色）

  // 常量定义
  #define PI 3.141592       // π
  #define TAU (PI*2.0)      // 2π，用于周期性动画

  // 随机数生成函数
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  // 柏林噪声实现：用于生成平滑的随机效果
  float noise(vec2 p){
    vec2 ip = floor(p);     // 整数部分
    vec2 u = fract(p);      // 小数部分
    u = u*u*(3.0-2.0*u);    // 平滑插值
    
    // 在四个角进行混合
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  // 分形布朗运动：叠加多层噪声以创造自然效果
  float fbm(vec2 p) {
    float r = 0.0;
    float amp = 1.0;        // 振幅
    float freq = 1.0;       // 频率
    for(int i = 0; i < 3; i++) {
      r += amp * noise(freq*p);
      amp *= 0.5;          // 每层振幅减半
      freq *= 1.0/0.5;     // 每层频率翻倍
    }
    return r;
  }

  // 2D旋转矩阵
  mat2 rot(float th){ 
    vec2 a = sin(vec2(1.5707963, 0.0) + th); 
    return mat2(a, -a.y, a.x); 
  }

  // 值映射函数：将输入值从一个范围映射到另一个范围
  float remap(float val, float im, float ix, float om, float ox) {
    return clamp(om + (val - im) * (ox - om) / (ix - im), om, ox);
  }

  // 圆形缓动函数：创建平滑的动画过渡
  float cio(float t) {
    return t < 0.5
    ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
    : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
  }

  // 动画高度计算函数：控制每个方块的高度动画
  float animHeight(vec2 p) {
    float s = 0.0, hs = 1.0;
    float t = mod(iTime, 7.0);  // 7秒循环

    // 第一阶段（1-2秒）：初始展开
    float tt = remap(t, 1.0, 2.0, 0.0, 1.0);
    s = mix(0.0, 0.3, cio(tt));

    // 第二阶段（3-4秒）：旋转
    tt = remap(t, 3.0, 4.0, 0.0, 1.0);
    p *= rot(cio(tt) * 3.0);

    // 第三阶段（4-5秒）：缩放
    tt = remap(t, 4.0, 5.0, 0.0, 1.0);
    s = mix(s, 1.0, cio(tt));

    // 第四阶段（5-6秒）：反向旋转
    tt = remap(t, 5.0, 6.0, 0.0, 1.0);
    p *= rot(-cio(tt) * 3.0);

    // 最后阶段（6.5-7秒）：淡出
    tt = remap(t, 6.5, 7.0, 0.0, 1.0);
    p *= rot(cio(tt) * 1.0);
    hs = mix(1.0, 0.0, cio(tt));

    // 脉冲效果：每6秒产生一次亮度波动
    float pls = (sin(t * TAU - PI*0.5) * 0.5 + 0.5) * step(mod(t, 6.0), 1.0) * 0.4;
    return (fbm(p * s + t * 0.5) + pls) * hs;
  }

  // 有向距离函数：计算点到方块的距离
  float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return length(max(d,0.0));
  }

  // 重复图案函数：创建网格效果
  vec2 rep(in vec2 p, in vec2 c) {
    return mod(p,c)-0.5*c;
  }

  // 场景映射函数：定义整个场景的几何形状
  float map(vec3 p) {
    // 创建圆形边界
    float bd = length(p.xz) - 5.0;
    if (bd > 0.1) {
      return bd;
    }
    // 计算网格ID和高度
    vec2 id = floor(p.xz / 0.2);
    float height = animHeight(id * 0.2) * 0.5;
    // 创建重复的方块
    p.xz = rep(p.xz, vec2(0.2));
    p.y -= height;
    float box = sdBox(p, vec3(0.03, height, 0.03));
    return max(box, bd) * 0.5;
  }

  // 光线追踪函数
  vec2 trace(vec3 p, vec3 ray, float mx) {
    float t = 0.0;
    vec3 pos;
    float dist;
    // 最多迭代128次
    for (int i = 0; i < 128; i++) {
      pos = p + ray * t;
      dist = map(pos);
      if (dist < 0.002 || t > mx) {
        break;
      }
      t += dist;
    }
    return vec2(t, dist);
  }

  // 颜色计算函数
  vec3 getColor(vec3 p, vec3 ray) {
    vec2 t = trace(p, ray, 100.0);
    vec3 pos = p + ray * t.x;
    if (t.x > 100.0) {
      return vec3(0.0);
    }
    
    // 根据主题设置颜色
    vec3 darkColor = vec3(0.2, 0.7, 0.4);   // 暗色主题颜色
    vec3 lightColor = vec3(0.4, 0.9, 0.2);  // 亮色主题颜色
    vec3 themeColor = mix(lightColor, darkColor, isDark);
    
    return max(themeColor * 7.0 * pow(pos.y, 4.0) * smoothstep(0.0, -1.0, length(pos.xz) - 5.0), vec3(0.0));
  }

  // 相机矩阵计算
  mat3 camera(vec3 ro, vec3 ta, float cr) {
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize(cross(cw,cp));
    vec3 cv = normalize(cross(cu,cw));
    return mat3(cu, cv, cw);
  }

  // 亮度计算
  float luminance(vec3 col) {
    return dot(vec3(0.3, 0.6, 0.1), col);
  }

  // ACES色调映射：改善HDR到LDR的转换
  vec3 acesFilm(const vec3 x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  // 主函数
  void main() {
    // 计算标准化的屏幕坐标
    vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    
    // 相机动画
    float t = iTime * 0.1;
    vec3 ro = vec3(cos(t) * 10.0, 5.5, sin(t) * 10.0);  // 相机位置
    vec3 ta = vec3(0.0, 1.0, 0.0);                       // 目标点
    mat3 c = camera(ro, ta, 0.0);
    vec3 ray = c * normalize(vec3(p, 2.5));
    vec3 col = getColor(ro, ray);
    
    // 体积光计算
    vec3 lp = vec3(0.0, 6.0, 0.0), rd = ray;
    float s = 7.5, vol = 0.0;
    for(int i = 0; i < 60; i++) {
      vec3 pos = ro + rd*s;
      vec3 v = -normalize(lp - pos);
      float tt = -(lp.y-2.0) / v.y;
      vec3 ppos = lp + v * tt;
      vol += pow(animHeight(ppos.xz), 3.0) * 0.05 * 
             smoothstep(0.0, 1.5, pos.y) * 
             smoothstep(-1.0, -4.0, length(ppos.xz) - 5.0);
      s += 0.1;
    }

    // 设置体积光颜色
    vec3 darkVolumeColor = vec3(0.3, 0.8, 1.0);
    vec3 lightVolumeColor = vec3(0.4, 0.8, 0.3);
    vec3 volumeColor = mix(lightVolumeColor, darkVolumeColor, isDark);
    
    float volIntensity = 1.4;
    if (t < 2.0) {
      volIntensity = 2.0 + sin(t * PI) * 1.5;
    } else if (t < 3.0) {
      volIntensity = 2.0 + sin((3.0 - t) * PI) * 1.5;
    } else {
      volIntensity += sin(t * 0.3) * 0.2;
    }
    
    col += volIntensity * volumeColor * vol;

    col = acesFilm(col * 0.5);           // 色调映射
    col = pow(col, vec3(1.0/2.2));       // gamma校正

    // 背景颜色混合 - 调整为更柔和的色调
    vec3 darkBg = vec3(0.02);            // 暗色背景
    vec3 lightBg = vec3(0.98, 0.97, 0.95); // 亮色背景：略微温暖的白色
    vec3 bgColor = mix(lightBg, darkBg, isDark);
    col = mix(bgColor, col, col);

    gl_FragColor = vec4(col, 1.0);
  }
`;
