'use client';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { TransitionContext } from '@/context/TransitionContext';

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function MotionWrapper({
  children,
  className = '',
}: MotionWrapperProps) {
  const pathname = usePathname();
  const { toggleCompleted } = useContext(TransitionContext);

  return (
    <motion.div
      key={pathname}
      className={`${className} w-full`}
      initial={{ opacity: 0, scale: 0.8, y: '-100%' }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
        },
      }}
      exit={{
        scale: 1,
        opacity: 1,
        position: 'absolute',
        transition: {
          y: { duration: 0.3, ease: [0.645, 0.045, 0.355, 1] },
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 },
        },
        y: '100%',
      }}
      onAnimationStart={() => toggleCompleted(false)}
      onAnimationComplete={() => toggleCompleted(true)}
    >
      {children}
    </motion.div>
  );
}
