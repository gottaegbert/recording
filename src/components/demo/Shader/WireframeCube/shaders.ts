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
  uniform float uExpand; // 添加展开系数参数 (0-1)
  
  #define PHOTOSENSITIVE_WARNING 0
  #define time iTime
  
  float segment(vec2 P, vec2 A, vec2 B, float r) 
  {
      vec2 g = B - A;
      vec2 h = P - A;
      float t = mod(A.y*3.0+A.x*5.0+time*9.0, 1.0);
      float t2 = mod(A.y*3.0+A.x*5.0+time*33.0, 1.0);
      float d = length(h - g * clamp(dot(g, h) / dot(g,g), t,t2));
      
      return 1.0/(1.0+300.0*pow(d,0.9));
  }
  
  vec3 rotatey(in vec3 p, float ang) { return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang));  }
  vec3 rotatex(in vec3 p, float ang) { return vec3(p.x,p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang));  }
  vec3 rotatez(in vec3 p, float ang) { return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang),p.z);  }
  
  void main()
  {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 p = 2.0*( fragCoord.xy / iResolution.xy ) -1.0;
      p.x *= iResolution.x/iResolution.y;
      vec3 col = vec3(0);
      
      // 线框的8个顶点
      vec3 baseVerts[8];
      vec3 verts[8];
      vec2 proj[8]; 
      
      // 定义完全展开时的立方体顶点
      baseVerts[0] = vec3(-5.0, -5.0, -15.0);
      baseVerts[1] = vec3(+5.0, -5.0, -15.0);
      baseVerts[2] = vec3(+5.0, +5.0, -15.0);
      baseVerts[3] = vec3(-5.0, +5.0, -15.0);
      baseVerts[4] = vec3(-5.0, -5.0, +15.0);
      baseVerts[5] = vec3(+5.0, -5.0, +15.0);
      baseVerts[6] = vec3(+5.0, +5.0, +15.0);
      baseVerts[7] = vec3(-5.0, +5.0, +15.0);
      
      // 定义收起时的直线顶点（将所有点放在一条 y 轴上）
      vec3 lineVerts[8];
      for (int i = 0; i < 8; i++) {
          lineVerts[i] = vec3(0.0, -1.0 + float(i) * 0.3, 0.0);
      }
      
      // 根据展开系数插值计算当前顶点位置
      for (int i = 0; i < 4; i++) {
          verts[i] = mix(lineVerts[i], baseVerts[i], uExpand);
          
          // 添加旋转（只有当展开时才完全旋转）
          float rotFactor = uExpand;
          verts[i] = rotatey(verts[i], 0.1 * time * rotFactor);
          verts[i] = rotatex(verts[i], 0.1 * time * rotFactor);
          verts[i] = rotatez(verts[i], 0.1 * time * rotFactor);
          
          // 计算投影
          float dist = -100.0;
          float mag = 4.0 + 2.0 * uExpand; // 随着展开而增大投影
          proj[i].x = mag * verts[i].x / (verts[i].z + dist);
          proj[i].y = mag * verts[i].y / (verts[i].z + dist);
      }
      
      // 使用明亮的蓝色
      vec3 lineColor = vec3(0.6, 0.4, 1.0);
      
      // 从直线状态到立方体，控制线段的可见性
      float edgeVisibility = uExpand;
      
      // 当展开系数很低时，只显示直线的部分线段
      if (uExpand < 0.1) {
          // 直线状态下只绘制相邻顶点之间的连线
          for (int i = 0; i < 7; i++) {
              col += lineColor * segment(p, proj[i], proj[i+1], 0.01);
          }
      } else {
          // 立方体的边缘
          col += lineColor * segment(p, proj[0], proj[1], 0.01) * edgeVisibility; 
          col += lineColor * segment(p, proj[1], proj[2], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[2], proj[3], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[3], proj[0], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[4], proj[5], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[5], proj[6], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[6], proj[7], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[7], proj[4], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[0], proj[4], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[1], proj[5], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[2], proj[6], 0.01) * edgeVisibility;
          col += lineColor * segment(p, proj[3], proj[7], 0.01) * edgeVisibility;
      }
      
      col *= 4.2;
      
      #if PHOTOSENSITIVE_WARNING
          col *= 2.2*sin(-p.y*1.0-50.0*time);
      #endif
      
      gl_FragColor = vec4(col, 1.0);
  }
`;

// Support for hot reload in development
declare global {
  interface Window {
    __WIREFRAME_CUBE_VERSION__?: number;
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initialize or increment the shader version counter
  window.__WIREFRAME_CUBE_VERSION__ =
    (window.__WIREFRAME_CUBE_VERSION__ || 0) + 1;
  const currentVersion = window.__WIREFRAME_CUBE_VERSION__;

  // Use setTimeout to ensure this runs after the module is fully loaded
  setTimeout(() => {
    // Only trigger if this is a hot reload (version > 1)
    if (currentVersion > 1) {
      console.log(
        '🔄 Wireframe cube shader code updated (v' +
          currentVersion +
          '), triggering reload...',
      );
      window.dispatchEvent(new Event('shader-reload'));
    }
  }, 0);
}
