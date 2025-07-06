'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardLoadingAnimationProps {
  onAnimationComplete?: () => void;
  cardText?: string;
}

export function CardLoadingAnimation({
  onAnimationComplete,
  cardText = 'Loading',
}: CardLoadingAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);

  // Animation duration and timing
  const MIN_ANIMATION_DURATION = 2500;
  const startTimeRef = useRef(Date.now());
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Door animation config
  const doorAnimationConfig = {
    delay: 0.5,
    duration: 1.2,
    ease: 'easeInOut' as const,
  };

  // Line animation variants
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
      left: '-1%',
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
      left: '101%',
      transition: doorAnimationConfig,
    },
  };

  useEffect(() => {
    // Ensure the animation runs for at least the minimum duration
    const timeElapsed = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - timeElapsed);

    animationTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, remainingTime);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background blur overlay */}
          <motion.div
            className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Left line */}
          <motion.div
            ref={leftLineRef}
            variants={leftLineVariants}
            initial="initial"
            animate={['show', 'move']}
            className="absolute top-0 z-30 w-[1px] -translate-x-1/2 transform bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
            style={{
              height: '100%',
              transformOrigin: 'top center',
            }}
          />

          {/* Right line */}
          <motion.div
            ref={rightLineRef}
            variants={rightLineVariants}
            initial="initial"
            animate={['show', 'move']}
            className="absolute top-0 z-30 w-[1px] -translate-x-1/2 transform bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
            style={{
              height: '100%',
              transformOrigin: 'top center',
            }}
          />

          {/* Left half */}
          <motion.div
            ref={leftHalfRef}
            className="absolute left-0 top-0 z-20 flex h-full w-1/2 items-center justify-end overflow-hidden bg-black pr-2"
            initial={{ x: 0 }}
            animate={{
              x: '-101%',
              transition: doorAnimationConfig,
            }}
          >
            {/* Left side text */}
            <motion.div
              className="text-2xl font-bold text-white"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1, // Keep visible, moving with the door
                transition: { duration: 0.3 },
                x: '-101%',
              }}
            >
              WHO3
            </motion.div>
          </motion.div>

          {/* Right half */}
          <motion.div
            ref={rightHalfRef}
            className="absolute right-0 top-0 z-20 flex h-full w-1/2 items-center justify-start overflow-hidden bg-black pl-2"
            initial={{ x: 0 }}
            animate={{
              x: '101%',
              transition: doorAnimationConfig,
            }}
          >
            {/* Right side text */}
            <motion.div
              className="text-2xl font-bold text-white"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1, // Keep visible, moving with the door
                transition: { duration: 0.3 },
                x: '101%',
              }}
            >
              Lab
            </motion.div>
          </motion.div>

          {/* Loading spinner (appears after doors open) */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: doorAnimationConfig.delay + doorAnimationConfig.duration,
                duration: 0.4,
              },
            }}
          >
            <div className="relative h-10 w-10">
              <motion.div
                className="absolute inset-0 h-full w-full rounded-full border-[3px] border-green-500 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
            <motion.p
              className="text-lg font-medium text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {cardText}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
