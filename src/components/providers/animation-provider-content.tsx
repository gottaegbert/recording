'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import OpeningAnimation from '@/components/animations/opening-animation';

interface AnimationProviderContentProps {
  pathname: string;
  onComplete: () => void;
}

export const AnimationProviderContent = ({
  pathname,
  onComplete,
}: AnimationProviderContentProps) => {
  const searchParams = useSearchParams();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // 检查URL参数是否强制显示动画（用于调试）
    const forceAnimation = searchParams.get('animation') === 'true';

    if (forceAnimation) {
      setShowAnimation(true);
      return;
    }

    // 在客户端使用 localStorage
    if (typeof window !== 'undefined') {
      // 首次访问时显示动画
      const hasVisited = localStorage.getItem('hasVisited');

      if (!hasVisited) {
        setShowAnimation(true);
        localStorage.setItem('hasVisited', 'true');
      } else {
        // 对特定页面也显示动画
        const specialPages = ['/']; // 添加更多需要显示动画的页面路径
        if (
          specialPages.includes(pathname) &&
          localStorage.getItem('lastPath') !== pathname
        ) {
          setShowAnimation(true);
        } else {
          // 如果不显示动画，立即标记页面为准备就绪
          onComplete();
        }
      }

      // 更新上次访问的路径
      localStorage.setItem('lastPath', pathname);
    }
  }, [pathname, searchParams, onComplete]);

  return showAnimation ? (
    <OpeningAnimation onLoadComplete={onComplete} />
  ) : null;
};
