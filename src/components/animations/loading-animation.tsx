'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingAnimationProps {
  onAnimationComplete?: () => void;
}

export function LoadingAnimation({
  onAnimationComplete,
}: LoadingAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);

  // 最短动画时间
  const MIN_ANIMATION_DURATION = 2500;
  const startTimeRef = useRef(Date.now());
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 动画配置
  const doorAnimationConfig = {
    delay: 0.8,
    duration: 1.2,
    ease: 'easeInOut' as const,
  };

  // 线条动画变体
  const leftLineVariants = {
    initial: { height: 0, opacity: 0, left: '50%' },
    show: {
      height: '100%',
      opacity: 1,
      left: '50%',
      transition: {
        height: { duration: 0.2, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
      },
    },
    move: {
      left: '-50%',
      transition: doorAnimationConfig,
    },
  };

  const rightLineVariants = {
    initial: { height: 0, opacity: 0, left: '50%' },
    show: {
      height: '100%',
      opacity: 1,
      left: '50%',
      transition: {
        height: { duration: 0.2, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
      },
    },
    move: {
      left: '150%',
      transition: doorAnimationConfig,
    },
  };

  useEffect(() => {
    // 一旦组件挂载，开始加载动画
    document.body.style.overflow = 'hidden';

    // 确保至少显示动画一段最短时间
    const timeElapsed = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - timeElapsed);

    animationTimeoutRef.current = setTimeout(() => {
      // 动画结束后恢复滚动
      document.body.style.removeProperty('overflow');
      setIsVisible(false);

      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, remainingTime);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      document.body.style.removeProperty('overflow');
    };
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 左侧切割线 */}
          <motion.div
            ref={leftLineRef}
            variants={leftLineVariants}
            initial="initial"
            animate={['show', 'move']}
            className="absolute top-0 z-30 w-[1px] -translate-x-1/2 transform bg-green-500 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
            style={{
              height: '100%',
              transformOrigin: 'top center',
            }}
          />

          {/* 右侧切割线 */}
          <motion.div
            ref={rightLineRef}
            variants={rightLineVariants}
            initial="initial"
            animate={['show', 'move']}
            className="absolute top-0 z-30 w-[1px] -translate-x-1/2 transform bg-green-500 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
            style={{
              height: '100%',
              transformOrigin: 'top center',
            }}
          />

          {/* 左半边 */}
          <motion.div
            ref={leftHalfRef}
            className="absolute left-0 top-0 z-20 flex h-full w-1/2 items-center justify-end overflow-hidden bg-black pr-2"
            initial={{ x: 0 }}
            animate={{
              x: '-100%',
              transition: doorAnimationConfig,
            }}
          >
            {/* 左侧文字 */}
            <motion.div
              className="text-4xl font-bold text-white"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1, // 保持可见，跟随门移动
                transition: { duration: 0.5 },
              }}
            >
              WHO3
            </motion.div>
          </motion.div>

          {/* 右半边 */}
          <motion.div
            ref={rightHalfRef}
            className="absolute right-0 top-0 z-20 flex h-full w-1/2 items-center justify-start overflow-hidden bg-black pl-2"
            initial={{ x: 0 }}
            animate={{
              x: '100%',
              transition: doorAnimationConfig,
            }}
          >
            {/* 右侧文字 */}
            <motion.div
              className="text-4xl font-bold text-white"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1, // 保持可见，跟随门移动
                transition: { duration: 0.5 },
              }}
            >
              Labs
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
