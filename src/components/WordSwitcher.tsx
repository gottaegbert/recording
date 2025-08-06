'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
const sections = {
  anyone: {
    title: 'For Everyone',
    text: 'I turn pixels into products. Design that works, code that ships.',
    color: 'from-red-900 to-gray-800',
  },
  recruiters: {
    title: 'For Recruiters',
    text: '5 years shipping AI products. I speak fluent design and developer.',
    color: 'from-orange-900 to-gray-800',
  },
  clients: {
    title: 'For Clients',
    text: 'Your idea → Awwwards winner. I build websites that make people stop scrolling.',
    color: 'from-yellow-900 to-gray-800',
  },
  'product-designers': {
    title: 'For Product Designers',
    text: "I make your Figma files actually buildable. Let's create magic together.",
    color: 'from-green-900 to-gray-800',
  },
  'product-managers': {
    title: 'For Product Managers',
    text: 'I translate between teams and turn roadmaps into reality. Zero friction.',
    color: 'from-blue-900 to-gray-800',
  },
  engineers: {
    title: 'For Engineers',
    text: 'React • Next • TypeScript • C#. I code like a developer, think like a designer.',
    color: 'from-purple-900 to-gray-800',
  },
};
interface WordSwitcherProps {
  className?: string;
}

export default function WordSwitcher({ className = '' }: WordSwitcherProps) {
  const [activeSection, setActiveSection] = useState<string>('anyone');
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth indicator movement
  useEffect(() => {
    const parent = indicatorRef.current?.parentNode as HTMLDivElement;
    const currentItem = parent?.querySelector(
      `[data-section="${activeSection}"]`,
    ) as HTMLDivElement;

    if (currentItem && indicatorRef.current) {
      const { width, left } = currentItem.getBoundingClientRect();
      const parentLeft = parent.getBoundingClientRect().left;

      indicatorRef.current.style.width = `${width}px`;
      indicatorRef.current.style.transform = `translateX(${left - parentLeft}px)`;
    }
  }, [activeSection]);

  const currentSection = sections[activeSection as keyof typeof sections];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Navigation Grid */}
        <div className="relative mb-12">
          {/* Sliding Indicator */}
          <div
            ref={indicatorRef}
            className={`pointer-events-none absolute left-0 top-0 h-full rounded-xl ${currentSection.color} bg-gradient-to-br opacity-30 transition-all duration-300 ease-out`}
            style={{ zIndex: 1 }}
          />

          <div
            className="relative grid grid-cols-12 gap-4"
            style={{ zIndex: 2 }}
          >
            {Object.keys(sections).map((key, index) => (
              <motion.button
                key={key}
                data-section={key}
                className={`group relative col-span-6 rounded-xl p-4 text-left transition-all duration-300 sm:col-span-4 lg:col-span-2 ${
                  activeSection === key
                    ? 'border border-white/30 bg-white/10 backdrop-blur-md'
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
                {/* Content */}
                <div className="relative z-10">
                  <div className="${currentSection.color} mb-1 text-sm font-medium text-white/80">
                    {sections[key as keyof typeof sections].title}
                  </div>
                  <div className="h-px w-8 bg-white/40 transition-colors duration-300 group-hover:bg-white/60" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="relative overflow-hidden">
          <div
            className={`flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br p-8 ${currentSection.color} border border-white/20 bg-opacity-10 backdrop-blur-sm transition-all duration-300`}
          >
            <div className="relative w-full max-w-4xl">
              {Object.keys(sections).map((key) => (
                <motion.h1
                  key={key}
                  className={`absolute inset-0 flex items-center justify-center text-center text-xl font-light leading-relaxed text-white transition-all duration-300 md:text-2xl lg:text-3xl ${
                    activeSection === key
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-8 opacity-0'
                  }`}
                  animate={{
                    opacity: activeSection === key ? 1 : 0,
                    x: activeSection === key ? 0 : 32,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.25, 0, 1],
                  }}
                >
                  {sections[key as keyof typeof sections].text}
                </motion.h1>
              ))}
            </div>
          </div>
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
