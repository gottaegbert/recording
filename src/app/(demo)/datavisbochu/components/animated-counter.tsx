'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to?: number;
  value?: number; // For compatibility with page.tsx usage
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
  className?: string;
  color?: string;
  animated?: boolean; // Whether to use animated digits
}

export function AnimatedCounter({
  from = 0,
  to,
  value, // For compatibility with page.tsx usage
  duration = 1500,
  delay = 0,
  formatter = (val: number) => val.toLocaleString(),
  className = '',
  color = '#60A5FA',
  animated = true, // Default to animated digits
}: AnimatedCounterProps) {
  // Handle both API styles (from/to or direct value)
  const targetValue = value !== undefined ? value : to;
  const initialValue = from;

  const [displayValue, setDisplayValue] = useState(initialValue);
  const previousValueRef = useRef(displayValue);
  const animationRef = useRef<number | null>(null);

  // Ensure we have a valid target value
  const finalTarget = targetValue !== undefined ? targetValue : 0;

  useEffect(() => {
    // Skip animation if no target or already at target
    if (finalTarget === displayValue) return;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Store start value to animate from
    const startValue = previousValueRef.current;

    // Add delay if specified
    const delayTimeout = setTimeout(() => {
      const startTime = performance.now();

      // Animation frame function
      const animateValue = (timestamp: number) => {
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smooth animation
        const easedProgress =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        // Calculate current value with proper rounding
        const currentValue =
          startValue + (finalTarget - startValue) * easedProgress;
        const roundedValue = Math.round(currentValue * 10) / 10; // Keep 1 decimal precision if needed

        setDisplayValue(roundedValue);

        if (progress < 1) {
          // Continue animation
          animationRef.current = requestAnimationFrame(animateValue);
        } else {
          // Ensure final value is exactly the target
          setDisplayValue(finalTarget);
          previousValueRef.current = finalTarget;
          animationRef.current = null;
        }
      };

      // Start animation
      animationRef.current = requestAnimationFrame(animateValue);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [finalTarget, duration, delay]);

  // Update previous value when props change
  useEffect(() => {
    previousValueRef.current = displayValue;
  }, [displayValue]);

  // Format the value
  const formattedValue = formatter(displayValue);

  // Convert to array of digits for animation
  const digits = formattedValue.split('');

  if (animated) {
    return (
      <div
        className={`relative flex items-center justify-center space-x-1 ${className}`}
      >
        {/* Animated digits display */}
        {digits.map((digit, index) => (
          <div
            key={`${index}-${digit}`}
            className="relative flex h-[1em] w-[0.6em] justify-center overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${index}-${digit}-${displayValue}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: 1,
                }}
                className="absolute"
                style={{ color }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}

        {/* Subtle animated underline */}
        <motion.div
          className="absolute -bottom-2 left-0 h-[1px]"
          style={{ backgroundColor: color }}
          animate={{ width: ['0%', '100%'] }}
          transition={{
            duration: 2,
            ease: 'linear',
            repeat: 1,
            repeatType: 'reverse',
          }}
        />
      </div>
    );
  }

  // Simple non-animated display
  return (
    <span className={className} style={{ color }}>
      {formattedValue}
    </span>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  delay?: number;
  color?: string;
  increase?: number;
  scale?: string;
}

export function StatsCard({
  title,
  value,
  unit = '',
  icon,
  delay = 0,
  color = '#60A5FA',
  increase,
  scale,
}: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#1e293b] p-4 shadow-lg">
      {/* Moving background texture */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${color} 0%, transparent 8%), 
                           radial-gradient(circle at 80% 70%, ${color} 0%, transparent 8%)`,
          backgroundSize: '60px 60px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px'],
        }}
        transition={{
          duration: 100,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>

      <div className="mt-2 flex items-baseline">
        <div className="text-2xl font-bold text-white">
          <AnimatedCounter
            from={0}
            to={value}
            delay={delay}
            color={color}
            duration={1500}
          />
        </div>
        {unit && <span className="ml-1 text-sm text-gray-400">{unit}</span>}
      </div>

      {increase !== undefined && (
        <div className="mt-1 flex items-center">
          {increase > 0 ? (
            <span className="text-sm text-green-400">↑ {increase}%</span>
          ) : (
            <span className="text-sm text-red-400">
              ↓ {Math.abs(increase)}%
            </span>
          )}
          {scale && (
            <span className="ml-1 text-sm text-gray-400">vs {scale}</span>
          )}
        </div>
      )}

      {/* Minimal progress indicator */}
      <motion.div
        className="absolute bottom-0 left-0 z-10 h-[2px]"
        style={{ backgroundColor: color }}
        animate={{ width: ['0%', '100%'] }}
        transition={{
          duration: 5,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatsCard
        title="客户总数"
        value={37846}
        delay={0.2}
        color="#60A5FA"
        increase={12.5}
        scale="去年"
      />
      <StatsCard
        title="制造产能"
        value={215876}
        unit="吨"
        delay={0.4}
        color="#34D399"
        increase={-8.2}
        scale="去年"
      />
    </div>
  );
}

// Counter with auto-incrementing functionality
export default function CounterVisualization({
  title,
  startValue,
  incrementBy,
  color,
}: {
  title: string;
  startValue: number;
  incrementBy: number;
  color: string;
}) {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + incrementBy);
    }, 5000);

    return () => clearInterval(interval);
  }, [incrementBy]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-lg p-4">
      {/* Moving background texture */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${color} 0%, transparent 8%), 
                           radial-gradient(circle at 80% 70%, ${color} 0%, transparent 8%)`,
          backgroundSize: '60px 60px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px'],
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <h3 className="z-10 mb-6 text-sm text-gray-400">{title}</h3>

      {/* Minimal progress indicator */}
      <motion.div
        className="absolute bottom-0 left-0 z-10 h-[2px]"
        style={{ backgroundColor: color }}
        animate={{ width: ['0%', '100%'] }}
        transition={{
          duration: 5,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {/* Digit display */}
      <div className="z-10 mb-6">
        <AnimatedCounter
          value={count}
          color={color}
          className="text-4xl font-bold"
          duration={1500}
        />
      </div>

      {/* Subtle accent element */}
      <motion.div
        className="z-10 h-[1px] w-16"
        style={{ backgroundColor: color }}
        animate={{ width: [16, 64, 16] }}
        transition={{
          duration: 5,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}
