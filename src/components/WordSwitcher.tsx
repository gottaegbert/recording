'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';

const sections = {
  anyone: {
    title: 'For anyone',
    text: 'I can be a designer can ship and also a developer focus on visual part. I build digital products that solve real problems, creating delightful experiences across multiple facets.',
    color: 'from-slate-400 to-slate-600',
  },
  recruiters: {
    title: 'Recruiters',
    text: "I'm a UX engineer or designer with 5 years of experience with AI product and 3D softwares, at companies large and small.",
    color: 'from-blue-400 to-blue-600',
  },
  'product-designers': {
    title: 'Product Designers',
    text: "I'm a team player with a high bar. I'll help you level up your understanding, influence and Figma game. We'll create experiences that are portfolio-worthy.",
    color: 'from-green-400 to-green-600',
  },
  'product-managers': {
    title: 'Product Managers',
    text: 'I collaborate closely with PMs, offering expertise from strategic vision to final delivery, ensuring we achieve the highest possible impact together.',
    color: 'from-orange-400 to-orange-600',
  },
  engineers: {
    title: 'Engineers',
    text: "I code with reactjs, nextjs, tailwindcss, typescript, and also some c# for game dev. I can be a UX engineer, maybe I can help you with the communication with the designers. Let's jam together.",
    color: 'from-red-400 to-red-600',
  },
};

interface WordSwitcherProps {
  showGrid?: boolean;
  className?: string;
}

export default function WordSwitcher({
  showGrid = false,
  className = '',
}: WordSwitcherProps) {
  const [activeSection, setActiveSection] = useState<string>('anyone');
  const [gridVisible, setGridVisible] = useState(showGrid);
  const textRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced grid animation with GSAP
  useEffect(() => {
    if (!gridRef.current) return;

    const lines = gridRef.current.querySelectorAll('.grid-line');

    if (gridVisible) {
      // Animate grid in with staggered effect
      gsap.fromTo(
        lines,
        {
          scale: 0,
          opacity: 0,
          transformOrigin: 'center',
        },
        {
          scale: 1,
          opacity: 0.3,
          duration: 0.6,
          stagger: {
            amount: 0.8,
            from: 'center',
            grid: 'auto',
          },
          ease: 'power2.out',
        },
      );
    } else {
      // Animate grid out
      gsap.to(lines, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: {
          amount: 0.3,
          from: 'edges',
        },
        ease: 'power2.in',
      });
    }
  }, [gridVisible]);

  // Enhanced text transition animation
  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline();

      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      })
        .call(() => {
          if (textRef.current) {
            textRef.current.innerText =
              sections[activeSection as keyof typeof sections].text;
          }
        })
        .to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
    }
  }, [activeSection]);

  const toggleGrid = () => {
    setGridVisible(!gridVisible);
  };

  const currentSection = sections[activeSection as keyof typeof sections];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Grid Overlay */}
      <div
        ref={gridRef}
        className="pointer-events-none fixed inset-0 z-10"
        style={{ display: gridVisible ? 'block' : 'none' }}
      >
        {/* Vertical Lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="grid-line absolute bottom-0 top-0 w-px bg-white/20"
            style={{ left: `${(i + 1) * (100 / 13)}%` }}
          />
        ))}
        {/* Horizontal Lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="grid-line absolute left-0 right-0 h-px bg-white/20"
            style={{ top: `${(i + 1) * (100 / 9)}%` }}
          />
        ))}
      </div>

      {/* Grid Toggle Button */}
      <motion.button
        onClick={toggleGrid}
        className="fixed right-6 top-6 z-50 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:bg-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="relative h-6 w-6">
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
            <div className="grid h-full w-full grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-sm bg-white" />
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
            <div className="absolute h-px w-4 rotate-45 bg-white" />
            <div className="absolute h-px w-4 -rotate-45 bg-white" />
          </motion.div>
        </div>
      </motion.button>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Navigation Grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Object.keys(sections).map((key, index) => (
            <motion.button
              key={key}
              className={`group relative rounded-xl p-4 text-left transition-all duration-500 ${
                activeSection === key
                  ? 'border border-white/30 bg-white/20 backdrop-blur-md'
                  : 'border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10'
              }`}
              onClick={() => setActiveSection(key)}
              onMouseEnter={() => setActiveSection(key)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.25, 0.25, 0, 1],
              }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
            >
              {/* Background Gradient */}
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${currentSection.color} opacity-0 transition-opacity duration-500 group-hover:opacity-20`}
                animate={{
                  opacity: activeSection === key ? 0.3 : 0,
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-1 text-sm font-medium text-white/80">
                  {sections[key as keyof typeof sections].title}
                </div>
                <div className="h-px w-8 bg-white/40 transition-colors duration-300 group-hover:bg-white/60" />
              </div>

              {/* Hover Indicator */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-white/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: activeSection === key ? 1 : 0,
                  scale: activeSection === key ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>

        {/* Text Content */}
        <div className="relative">
          <motion.div
            className={`flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br p-8 ${currentSection.color} border border-white/20 bg-opacity-10 backdrop-blur-sm`}
            key={activeSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.25, 0, 1] }}
          >
            <h1
              ref={textRef}
              className="max-w-4xl text-center text-xl font-light leading-relaxed text-white md:text-2xl lg:text-3xl"
            >
              {currentSection.text}
            </h1>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {Object.keys(sections).map((key) => (
            <motion.div
              key={key}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeSection === key ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              onClick={() => setActiveSection(key)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
