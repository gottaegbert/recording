'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
const sections = {
  anyone: {
    title: 'For Everyone',
    text: 'I turn pixels into products. Design that works, code that ships.',
    color: 'from-slate-400 to-slate-600',
  },
  recruiters: {
    title: 'For Recruiters',
    text: '5 years shipping AI products. I speak fluent design and developer.',
    color: 'from-blue-400 to-blue-600',
  },
  clients: {
    title: 'For Clients',
    text: 'Your idea → Awwwards winner. I build websites that make people stop scrolling.',
    color: 'from-red-400 to-red-600',
  },
  'product-designers': {
    title: 'For Product Designers',
    text: "I make your Figma files actually buildable. Let's create magic together.",
    color: 'from-green-400 to-green-600',
  },
  'product-managers': {
    title: 'For Product Managers',
    text: 'I translate between teams and turn roadmaps into reality. Zero friction.',
    color: 'from-orange-400 to-orange-600',
  },
  engineers: {
    title: 'For Engineers',
    text: 'React • Next • TypeScript • C#. I code like a developer, think like a designer.',
    color: 'from-purple-400 to-purple-600',
  },
};
interface WordSwitcherProps {
  className?: string;
}

export default function WordSwitcher({ className = '' }: WordSwitcherProps) {
  const [activeSection, setActiveSection] = useState<string>('anyone');
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced text transition animation
  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline();

      tl.call(() => {
        if (textRef.current) {
          textRef.current.innerText =
            sections[activeSection as keyof typeof sections].text;
        }
      }).to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [activeSection]);

  const currentSection = sections[activeSection as keyof typeof sections];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Navigation Grid */}
        <div className="mb-12 grid grid-cols-12 gap-4">
          {Object.keys(sections).map((key, index) => (
            <motion.button
              key={key}
              className={`group relative col-span-6 rounded-xl p-4 text-left transition-all duration-500 sm:col-span-4 lg:col-span-2 ${
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
