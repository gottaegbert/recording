'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  const router = useRouter();
  const controls = useAnimation();
  const [isScrolling, setIsScrolling] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);

  // 动画循环
  useEffect(() => {
    controls.start({
      y: [0, 12, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    });
  }, [controls]);

  // 处理滚动
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let transitionTriggered = false;

    const handleScroll = () => {
      if (transitionTriggered) return;

      const currentScrollY = window.scrollY;
      const scrollThreshold = window.innerHeight * 0.3; // 30% 的视窗高度

      // 如果向下滚动超过阈值
      if (currentScrollY > scrollThreshold && !isScrolling) {
        transitionTriggered = true;
        handleTransition();
      }

      // 更新滚动位置
      lastScrollY = currentScrollY;
    };

    const handleTransition = async () => {
      try {
        setShowIndicator(false);
        // 执行离开动画
        await controls.start({
          y: -100,
          opacity: 0,
          transition: { duration: 0.5, ease: 'easeInOut' },
        });

        // 页面跳转
        router.push('/workingon');
      } catch (error) {
        console.error('Transition error:', error);
        router.push('/workingon');
      }
    };

    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router, controls, isScrolling]);

  if (!showIndicator) return null;

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
