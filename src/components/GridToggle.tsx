'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';

export default function GridToggle() {
  const [gridVisible, setGridVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Enhanced grid animation with GSAP
  useEffect(() => {
    if (!gridRef.current) return;

    const lines = gridRef.current.querySelectorAll('.line');

    if (gridVisible) {
      // Add visible class to trigger CSS transition
      gridRef.current.classList.add('is--visible');

      // Additional GSAP animation for stagger effect
      gsap.fromTo(
        lines,
        {
          height: 0,
        },
        {
          height: '100%',
          duration: 1,
          stagger: {
            amount: 0.6,
            from: 'start',
          },
          ease: 'power2.out',
        },
      );
    } else {
      // Remove visible class
      gridRef.current.classList.remove('is--visible');

      // Animate out
      gsap.to(lines, {
        height: 0,
        duration: 0.5,
        stagger: {
          amount: 0.3,
          from: 'end',
        },
        ease: 'power2.in',
      });
    }
  }, [gridVisible]);

  const toggleGrid = () => {
    setGridVisible(!gridVisible);
  };

  return (
    <>
      {/* Grid Overlay - Using CSS Grid System */}
      <div
        ref={gridRef}
        className="app-grid-overlay"
        style={{ display: gridVisible ? 'grid' : 'none' }}
      >
        {/* Generate 12 columns */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`column-${i}`} className="column">
            <div className="line" />
            <div className="line" />
          </div>
        ))}
      </div>

      {/* Grid Toggle Button */}
      <Button variant="outline" size="icon" onClick={toggleGrid} asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative h-[1.2rem] w-[1.2rem]">
            {/* Grid Icon */}
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: gridVisible ? 0 : 1,
                scale: gridVisible ? 0.8 : 1,
                rotate: gridVisible ? 45 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid h-full w-full grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-[1px] bg-current" />
                ))}
              </div>
            </motion.div>

            {/* Close Icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: gridVisible ? 1 : 0,
                scale: gridVisible ? 1 : 0.8,
                rotate: gridVisible ? 0 : -45,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute h-px w-3 rotate-45 bg-current" />
              <div className="absolute h-px w-3 -rotate-45 bg-current" />
            </motion.div>
          </div>
          <span className="sr-only">Toggle grid</span>
        </motion.button>
      </Button>
    </>
  );
}
