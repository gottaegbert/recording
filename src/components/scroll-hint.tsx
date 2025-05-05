'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollHint() {
  return (
    <motion.div
      className="fixed bottom-20 flex w-screen flex-col items-center justify-center gap-2 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      <motion.span
        className="text-sm text-white/70"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to Explore
      </motion.span>
      <motion.div
        className="rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </motion.div>
  );
}
