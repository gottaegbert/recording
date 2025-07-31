'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings
    lenisRef.current = new Lenis({
      lerp: 0.1, // Smooth interpolation intensity (0-1)
      duration: 1.2, // Scroll animation duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      prevent: (node) => {
        // Prevent smooth scrolling on specific elements
        return (
          node.classList.contains('no-smooth-scroll') ||
          node.hasAttribute('data-lenis-prevent')
        );
      },
    });

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Optional: Listen to scroll events
    lenisRef.current.on('scroll', (e) => {
      // You can add custom scroll event handling here
      // console.log('Lenis scroll:', e);
    });

    // Cleanup on unmount
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
