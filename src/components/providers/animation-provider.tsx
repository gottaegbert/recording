'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AnimationProviderContent } from './animation-provider-content';

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
  const pathname = usePathname();
  const [isPageReady, setIsPageReady] = useState(false);

  // 处理动画完成事件
  const handleAnimationComplete = () => {
    setIsPageReady(true);
  };

  return (
    <>
      <Suspense fallback={null}>
        <AnimationProviderContent
          pathname={pathname}
          onComplete={handleAnimationComplete}
        />
      </Suspense>

      <div
        className={`transition-opacity duration-1000 ${isPageReady ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!isPageReady}
      >
        {children}
      </div>
    </>
  );
};
