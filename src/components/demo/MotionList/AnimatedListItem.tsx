import { motion } from 'motion/react';
import { ReactNode } from 'react';

let base = 4;
let t = (d: number) => d * base;

interface AnimatedListItemProps {
  children: ReactNode;
}

export default function AnimatedListItem({ children }: AnimatedListItemProps) {
  return (
    <motion.li
      className="relative"
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: 'auto',
        opacity: 1,
        transition: {
          type: 'spring',
          bounce: 0.3,
          opacity: { delay: t(0.025) },
        },
      }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        duration: t(0.15),
        type: 'spring',
        bounce: 0.3,
        opacity: { duration: t(0.03) },
      }}
    >
      {children}
    </motion.li>
  );
}
