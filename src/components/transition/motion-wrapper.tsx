'use client';
import { motion } from 'motion/react';
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
      initial={{ opacity: 0, scale: 1, y: '-100%' }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          type: 'spring',
          bounce: 0.1,
        },
      }}
      onAnimationStart={() => toggleCompleted(false)}
      onAnimationComplete={() => toggleCompleted(true)}
    >
      {children}
    </motion.div>
  );
}
