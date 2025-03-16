'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimation();
  const [isScrolling, setIsScrolling] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);

  const isHomePage = pathname === '/';

  // 动画循环
  useEffect(() => {
    if (!isHomePage) return;

    controls.start({
      y: [0, 12, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    });
  }, [controls, isHomePage]);

  // 处理滚动
  useEffect(() => {
    if (!isHomePage) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let transitionTriggered = false;

    const handleScroll = () => {
      if (transitionTriggered) return;

      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const scrollThreshold = window.innerHeight * 0.3; // 增加到 50% 的视窗高度
      const timeThreshold = 100; // 100ms 内的快速滚动
      const scrollSpeed =
        Math.abs(currentScrollY - lastScrollY) / (currentTime - lastScrollTime);

      const isScrollingDown = currentScrollY > lastScrollY;
      const isScrollingFast = scrollSpeed > 0.5; // 增加滚动速度阈值

      // 在主页，向下滚动超过阈值时跳转到 workingon
      if (
        isScrollingDown &&
        currentScrollY > scrollThreshold &&
        isScrollingFast &&
        !isScrolling
      ) {
        transitionTriggered = true;
        handleTransition('/workingon');
      }
      // 在 workingon 页面，向上滚动超过阈值时返回主页
      else if (
        !isHomePage &&
        currentScrollY < scrollThreshold &&
        !isScrolling
      ) {
        transitionTriggered = true;
        handleTransition('/');
      }

      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
    };

    const handleTransition = async (path: string) => {
      try {
        setShowIndicator(false);
        // 执行离开动画
        await controls.start({
          y: -100,
          opacity: 0,
          transition: { duration: 0.5, ease: 'easeInOut' },
        });

        // 页面跳转
        router.push(path);
      } catch (error) {
        console.error('Transition error:', error);
        router.push(path);
      }
    };

    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router, controls, isScrolling, isHomePage]);

  // 处理触摸事件
  useEffect(() => {
    if (!isHomePage) return;

    let startY = 0;
    let startTime = 0;
    let transitionTriggered = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (transitionTriggered) return;

      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaY = startY - currentY;
      const deltaTime = currentTime - startTime;
      const swipeSpeed = Math.abs(deltaY) / deltaTime;

      const threshold = 100; // 增加触摸滑动阈值
      const speedThreshold = 0.5; // 添加速度阈值

      // 主页向上滑动
      if (deltaY > threshold && swipeSpeed > speedThreshold) {
        transitionTriggered = true;
        handleTransition('/workingon');
      }
    };

    const handleTransition = async (path: string) => {
      try {
        setShowIndicator(false);
        await controls.start({
          y: -100,
          opacity: 0,
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
        router.push(path);
      } catch (error) {
        console.error('Transition error:', error);
        router.push(path);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [router, controls, isHomePage]);

  if (!isHomePage || !showIndicator) return null;

  return (
    <motion.div
      animate={controls}
      className="scroll-indicator flex flex-col items-center gap-2"
      initial={{ opacity: 1, y: 0 }}
    >
      <span className="text-sm text-muted-foreground">Scroll to Enter</span>
      <motion.div
        className="rounded-full border border-border/50 bg-background/50 p-2 backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </motion.div>
  );
}
