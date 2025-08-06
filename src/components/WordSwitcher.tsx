'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
const sections = {
  anyone: {
    title: 'For Everyone',
    text: 'I turn pixels into products. Design that works, code that ships. Not a designer or developer, but a builder',
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
    title: 'For Designers',
    text: "I make your Figma files actually buildable. Let's create magic together.",
    color: 'from-green-900 to-gray-800',
  },
  'product-managers': {
    title: 'For PMs',
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
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get visible sections based on screen size
  const getVisibleSections = () => {
    const allSections = Object.keys(sections);
    // On mobile (< 640px), show only first 3 tabs
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return allSections.slice(0, 3);
    }
    return allSections;
  };

  const [visibleSections, setVisibleSections] =
    useState<string[]>(getVisibleSections());

  // Update visible sections on window resize
  useEffect(() => {
    const handleResize = () => {
      const newVisibleSections = getVisibleSections();
      setVisibleSections(newVisibleSections);

      // If current active section is not visible on mobile, switch to first visible
      if (!newVisibleSections.includes(activeSection)) {
        setActiveSection(newVisibleSections[0]);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

  // Autoplay functionality
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }

      autoplayIntervalRef.current = setInterval(() => {
        if (!isUserInteracting && !hoveredSection) {
          setActiveSection((currentSection) => {
            const currentIndex = visibleSections.indexOf(currentSection);
            const nextIndex = (currentIndex + 1) % visibleSections.length;
            return visibleSections[nextIndex];
          });
        }
      }, 5000);
    };

    const stopAutoplay = () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };

    // Start autoplay when component mounts
    startAutoplay();

    // Cleanup on unmount
    return () => stopAutoplay();
  }, [visibleSections, isUserInteracting, hoveredSection]);

  // Handle user interaction states
  const handleMouseEnter = (key: string) => {
    setIsUserInteracting(true);
    setActiveSection(key);
    setHoveredSection(key);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
    // Delay resetting user interaction to prevent immediate autoplay
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 1000);
  };

  const handleClick = (key: string) => {
    setIsUserInteracting(true);
    setActiveSection(key);
    // Reset user interaction after a longer delay for clicks
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  // Smooth indicator movement
  useEffect(() => {
    const parent = indicatorRef.current?.parentNode as HTMLDivElement;
    const currentItem = parent?.querySelector(
      `[data-section="${activeSection}"]`,
    ) as HTMLDivElement;

    if (currentItem && indicatorRef.current) {
      const { width, left, height } = currentItem.getBoundingClientRect();
      const parentLeft = parent.getBoundingClientRect().left;

      indicatorRef.current.style.width = `${width}px`;
      indicatorRef.current.style.height = `${height}px`;
      indicatorRef.current.style.transform = `translateX(${left - parentLeft}px)`;
    }
  }, [activeSection]);

  const currentSection = sections[activeSection as keyof typeof sections];

  return (
    <>
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(
            circle at center,
            var(--tw-gradient-stops)
          );
        }
      `}</style>
      <div ref={containerRef} className={`relative w-full ${className}`}>
        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Navigation Grid */}
          <div className="relative mb-4">
            {/* Sliding Indicator */}
            <div
              ref={indicatorRef}
              className={`pointer-events-none absolute left-0 top-0 h-full rounded-sm ${currentSection.color} bg-gradient-to-br opacity-40 transition-all duration-300 ease-out`}
              style={{ zIndex: 1 }}
            />

            <div
              className="relative grid grid-cols-12 gap-3"
              style={{ zIndex: 2 }}
            >
              {visibleSections.map((key, index) => (
                <motion.button
                  key={key}
                  data-section={key}
                  className={`group relative col-span-4 rounded-sm p-3 text-left transition-all duration-300 sm:col-span-4 lg:col-span-2 ${
                    activeSection === key
                      ? 'border border-white/30 bg-white/10 backdrop-blur-md'
                      : 'border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => handleClick(key)}
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
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
                  {/* Flashlight Effect */}
                  <motion.div
                    className="bg-gradient-radial pointer-events-none absolute inset-0 rounded-sm from-white/20 via-white/5 to-transparent opacity-0"
                    animate={{
                      opacity:
                        activeSection === key || hoveredSection === key ? 1 : 0,
                      scale:
                        activeSection === key || hoveredSection === key
                          ? 1
                          : 0.8,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div
                      className={`text-sm font-medium transition-all duration-300 ${
                        activeSection === key || hoveredSection === key
                          ? 'text-white drop-shadow-sm'
                          : 'text-white/80'
                      }`}
                      animate={{
                        textShadow:
                          activeSection === key || hoveredSection === key
                            ? '0 0 8px rgba(255,255,255,0.3)'
                            : '0 0 0px rgba(255,255,255,0)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {sections[key as keyof typeof sections].title}
                    </motion.div>
                    <motion.div
                      className={`h-px w-8 transition-all duration-300 ${
                        activeSection === key || hoveredSection === key
                          ? 'bg-white shadow-sm shadow-white/30'
                          : 'bg-white/40'
                      }`}
                      animate={{
                        boxShadow:
                          activeSection === key || hoveredSection === key
                            ? '0 0 4px rgba(255,255,255,0.4)'
                            : '0 0 0px rgba(255,255,255,0)',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="relative overflow-hidden">
            <div
              className={`flex h-48 items-center justify-start rounded-sm bg-gradient-to-br p-8 ${currentSection.color} border border-white/20 bg-opacity-10 backdrop-blur-sm transition-all duration-300`}
            >
              {/* Flashlight Effect for Text Area */}
              <motion.div
                className="bg-gradient-radial pointer-events-none absolute inset-0 rounded-sm from-white/10 via-white/5 to-transparent opacity-0"
                animate={{
                  opacity: hoveredSection ? 0.8 : 0.4,
                  scale: hoveredSection ? 1.02 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />

              <div className="relative z-10 w-full max-w-4xl">
                {Object.keys(sections).map((key) => (
                  <motion.h1
                    key={key}
                    className={`absolute inset-0 flex items-center justify-center text-xl font-light leading-relaxed transition-all duration-300 md:text-2xl lg:text-3xl ${
                      activeSection === key
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-8 opacity-0'
                    }`}
                    animate={{
                      opacity: activeSection === key ? 1 : 0,
                      x: activeSection === key ? 0 : 32,
                      color: hoveredSection ? '#ffffff' : '#e5e7eb',
                      textShadow: hoveredSection
                        ? '0 0 12px rgba(255,255,255,0.4)'
                        : '0 0 0px rgba(255,255,255,0)',
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
          {/* <div className="z-1 -mt-8 flex justify-center space-x-2">
            {visibleSections.map((key) => (
              <motion.div
                key={key}
                className={`h-1 rounded-sm transition-all duration-300 ${
                  activeSection === key ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
                onClick={() => setActiveSection(key)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
}
