'use client';

import { ReactNode, useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

interface LenisProviderProps {
  children: ReactNode;
  options?: {
    lerp?: number;
    duration?: number;
    smoothWheel?: boolean;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal';
    touchMultiplier?: number;
    wheelMultiplier?: number;
    infinite?: boolean;
    // 其他Lenis选项
  };
  disabledPaths?: string[];
}

// 定义上下文的类型
interface LenisContextType {
  lenis: Lenis | null;
  isDisabled: boolean;
}

// 创建上下文以便共享 Lenis 实例
const LenisContext = createContext<LenisContextType>({
  lenis: null,
  isDisabled: false,
});

export default function LenisProvider({
  children,
  options = {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1,
    orientation: 'vertical',
  },
  disabledPaths = [
    '/3dpages/simulation',
    '/3dpages/metalness',
    '/3dpages/cut',
    '/',
  ], // 默认在3D仿真页面上禁用
}: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // 检查当前路径是否应该禁用Lenis
  const isLenisDisabled = disabledPaths.some((path) => pathname.includes(path));

  // 初始化 Lenis
  useEffect(() => {
    // 如果当前路径需要禁用Lenis，则不初始化
    if (isLenisDisabled) {
      console.log('Lenis disabled for path:', pathname);
      return;
    }

    const lenis = new Lenis({
      lerp: options.lerp,
      duration: options.duration,
      smoothWheel: options.smoothWheel,
      wheelMultiplier: options.wheelMultiplier,
      orientation: options.orientation,
      gestureOrientation: options.gestureOrientation,
      infinite: options.infinite,
    });

    lenisRef.current = lenis;

    // 监听URL变化时滚动到顶部
    const handleRouteChange = () => {
      lenis.scrollTo(0, { immediate: true });
    };

    window.addEventListener('popstate', handleRouteChange);

    // 清理函数
    return () => {
      lenis.destroy();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [options, pathname, isLenisDisabled]);

  // 动画循环
  useEffect(() => {
    if (isLenisDisabled || !lenisRef.current) return;

    const animate = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isLenisDisabled]);

  // 滚动到哈希锚点的功能
  useEffect(() => {
    if (isLenisDisabled || !lenisRef.current) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && lenisRef.current) {
        const target = document.querySelector(hash) as HTMLElement;
        if (target) {
          // 等待DOM更新完成
          setTimeout(() => {
            lenisRef.current?.scrollTo(target, {
              offset: -100, // 可自定义偏移量
              duration: 1.5,
            });
          }, 100);
        }
      }
    };

    // 页面加载时检查是否有哈希值
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLenisDisabled]);

  return (
    <LenisContext.Provider
      value={{ lenis: lenisRef.current, isDisabled: isLenisDisabled }}
    >
      {children}
    </LenisContext.Provider>
  );
}

// 用于其他组件访问Lenis实例的hook
export function useLenis() {
  const context = useContext(LenisContext);
  return context.lenis;
}

// 新增hook，提供更完整的Lenis状态信息
export function useLenisState() {
  return useContext(LenisContext);
}
