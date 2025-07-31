# 网格系统文档

基于你提供的网格token样式，我已经重新设计了网格展示和整体排版系统。

## 主要特性

### 1. CSS变量驱动的网格系统
```css
:root {
  --grid--app-margin: 1.5rem;
  --grid--app-columns: repeat(12, 1fr);
  --grid--app-gutter: 1.5rem;
  --color--foreground--15: rgba(255, 255, 255, 0.15);
}
```

### 2. 响应式网格边距
- **移动端**: `--grid--mobile-margin: 1rem`
- **平板端**: `--grid--tablet-margin: 1.5rem`
- **桌面端**: `--grid--desktop-margin: 2rem`

### 3. 可视化网格覆盖层
```css
.app-grid-overlay {
  z-index: 101;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0 var(--grid--app-margin);
  display: grid;
  grid-template-columns: var(--grid--app-columns);
  gap: var(--grid--app-gutter);
  pointer-events: none;
}
```

## 组件更新

### GridToggle 组件
- 使用新的CSS网格系统
- 平滑的动画过渡效果
- 支持GSAP动画增强

### 布局组件
- **WordSwitcher**: 更新为12列网格布局
- **主页面各部分**: 统一使用12列网格系统
- **响应式设计**: 移动端、平板端、桌面端适配

### 工具函数
```typescript
// 响应式网格类名生成
gridResponsive(12, 6, 4) // 移动端12列，平板6列，桌面4列

// 网格跨度
gridSpan(6, 'md') // md:col-span-6

// 网格起始位置
gridStart(3, 'lg') // lg:col-start-3
```

## 使用方法

### 1. 基本网格布局
```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 md:col-span-6">
    内容区域
  </div>
  <div className="col-span-12 md:col-span-6">
    侧边栏
  </div>
</div>
```

### 2. 启用网格覆盖层
```tsx
import GridToggle from '@/components/GridToggle';

<GridToggle />
```

### 3. 使用工具函数
```tsx
import { gridResponsive, cn } from '@/lib/utils';

<div className={cn('grid grid-cols-12 gap-6')}>
  <div className={gridResponsive(12, 6, 4)}>
    响应式内容
  </div>
</div>
```

## 演示页面

访问 `/grid-system` 查看完整的网格系统演示和文档。

## 文件结构

```
src/
├── components/
│   ├── GridToggle.tsx          # 网格切换组件
│   ├── GridLayout.tsx          # 网格布局组件
│   ├── GridDemo.tsx            # 网格演示组件
│   └── GridSystemDocs.tsx      # 网格系统文档组件
├── app/
│   ├── globals.css             # 网格CSS变量和样式
│   └── (demo)/grid-system/     # 网格系统演示页面
└── lib/
    └── utils.ts                # 网格工具函数
```

## 技术特点

1. **基于CSS变量**: 易于主题化和定制
2. **响应式设计**: 适配不同屏幕尺寸
3. **可视化调试**: 开发时可显示网格线
4. **TypeScript支持**: 完整的类型定义
5. **动画增强**: GSAP驱动的平滑动画
6. **开发友好**: 丰富的工具函数和组件

这个网格系统完全基于你提供的token样式，提供了一致的布局基础和强大的开发体验。
