'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpeningAnimationProps {
  onLoadComplete?: () => void;
}

const OpeningAnimation = ({ onLoadComplete }: OpeningAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, cutting, complete
  const startTime = useRef(Date.now());
  const isPageLoaded = useRef(false);

  // 最短动画持续时间（毫秒）
  const MIN_ANIMATION_DURATION = 3000;

  // 监测实际页面加载
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let minDurationTimeout: NodeJS.Timeout;

    // 获取初始加载进度
    const initialProgress = Math.min(
      document.readyState === 'complete'
        ? 100
        : document.readyState === 'interactive'
          ? 70
          : 30,
      100,
    );

    setProgress(initialProgress / 100);

    // 如果页面已经加载完成
    if (document.readyState === 'complete') {
      isPageLoaded.current = true;

      // 但仍然要等待最短动画时间
      const timeElapsed = Date.now() - startTime.current;
      const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - timeElapsed);

      // 如果还没到最短时间，设置一个定时器等待剩余时间
      if (remainingTime > 0) {
        // 继续模拟加载进度，直到最短时间结束
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime.current;
          const progressPercent = Math.min(elapsed / MIN_ANIMATION_DURATION, 1);
          setProgress(progressPercent);
        }, 50);

        // 在最短时间结束后进入切割阶段
        minDurationTimeout = setTimeout(() => {
          if (progressInterval) clearInterval(progressInterval);
          handleLoadComplete();
        }, remainingTime);
      } else {
        // 如果已经超过最短时间，直接完成
        handleLoadComplete();
      }
    } else {
      // 监听页面加载完成事件
      window.addEventListener('load', onPageLoad);

      // 渐进增加进度，不超过90%，直到页面完全加载
      progressInterval = setInterval(() => {
        const timeElapsed = Date.now() - startTime.current;
        const progressPercent = Math.min(
          timeElapsed / MIN_ANIMATION_DURATION,
          0.9,
        );

        // 使用时间流逝和加载状态的结合来确定进度
        setProgress((prevProgress) => {
          // 如果进度接近100%但页面尚未完全加载，保持在90%
          if (prevProgress >= 0.9) return 0.9;

          // 否则缓慢增加进度，但考虑最短动画时间
          return Math.min(progressPercent, prevProgress + 0.01);
        });
      }, 50);
    }

    function onPageLoad() {
      isPageLoaded.current = true;

      // 检查是否已经达到最短动画时间
      const timeElapsed = Date.now() - startTime.current;
      const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - timeElapsed);

      // 如果还没到最短时间，等待剩余时间
      if (remainingTime > 0) {
        minDurationTimeout = setTimeout(() => {
          handleLoadComplete();
        }, remainingTime);
      } else {
        // 如果已经超过最短时间，直接完成
        handleLoadComplete();
      }
    }

    function handleLoadComplete() {
      // 停止进度增长
      if (progressInterval) clearInterval(progressInterval);

      // 设置进度为100%
      setProgress(1);

      // 按顺序执行动画阶段
      setTimeout(() => {
        // 切割阶段
        setPhase('cutting');

        // 延迟后进入完成阶段
        setTimeout(() => {
          setPhase('complete');

          // 动画完全结束后，隐藏preloader并通知父组件
          setTimeout(() => {
            setIsVisible(false);
            if (onLoadComplete) onLoadComplete();
          }, 500);
        }, 1000);
      }, 300);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (minDurationTimeout) clearTimeout(minDurationTimeout);
      window.removeEventListener('load', onPageLoad);
    };
  }, [onLoadComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          {/* 整个页面的背景遮罩，确保下方内容不可见 */}
          <div className="absolute inset-0 bg-black"></div>

          {/* 上方黑色区域 */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[50vh] bg-black"
            initial={{ y: 0 }}
            animate={{
              y: phase === 'complete' ? '-100%' : 0,
            }}
            transition={{
              y: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
            }}
          />

          {/* 下方黑色区域 */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[50vh] bg-black"
            initial={{ y: 0 }}
            animate={{
              y: phase === 'complete' ? '100%' : 0,
            }}
            transition={{
              y: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
            }}
          />

          {/* 中间的水平进度线 - 只在加载阶段显示 */}
          {phase === 'loading' && (
            <>
              <motion.div
                className="absolute z-10 h-[2px]"
                style={{
                  width: `${progress * 100}%`,
                  background: 'white',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                }}
              />
              <div className="absolute left-4 top-[calc(50%+15px)] text-sm text-white opacity-70">
                {Math.round(progress * 100)}%
              </div>

              {/* Preloader文字 */}
              <div className="absolute left-4 top-[calc(50%-30px)] text-sm font-light tracking-wider text-white opacity-50">
                LOADING WEBSITE
              </div>
            </>
          )}

          {/* 切割效果的光线 - 只在切割阶段显示 */}
          {phase === 'cutting' && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.2, 1] }}
            >
              <div
                className="absolute h-[2px] w-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, white, transparent)',
                  top: '50%',
                  boxShadow: '0 0 20px 2px rgba(255, 255, 255, 0.8)',
                }}
              />
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default OpeningAnimation;
