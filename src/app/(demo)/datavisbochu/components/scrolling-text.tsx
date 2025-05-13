'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollingTextProps {
  messages: string[];
  interval?: number; // 轮播间隔，单位为毫秒
  paused?: boolean;
}

export function ScrollingText({
  messages,
  interval = 5000,
  paused = false,
}: ScrollingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (paused || messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval, paused]);

  return (
    <div className="relative h-10 w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute w-full text-center"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <p className="text-sm text-gray-300">{messages[currentIndex]}</p>
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 带有打字效果的滚动文字组件
export function TypewriterText({
  messages,
  interval = 5000,
  paused = false,
}: ScrollingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // 处理文字轮播
  useEffect(() => {
    if (paused || messages.length <= 1) return;

    const rotationTimer = setInterval(() => {
      setIsTyping(true);
      setDisplayText('');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);

    return () => clearInterval(rotationTimer);
  }, [messages, interval, paused]);

  // 处理打字效果
  useEffect(() => {
    if (!isTyping) return;

    const currentMessage = messages[currentIndex];
    if (displayText.length < currentMessage.length) {
      const typingTimer = setTimeout(() => {
        setDisplayText(currentMessage.substring(0, displayText.length + 1));
      }, 50); // 打字速度

      return () => clearTimeout(typingTimer);
    } else {
      setIsTyping(false);
    }
  }, [displayText, currentIndex, messages, isTyping]);

  return (
    <div className="flex h-10 items-center justify-center space-x-3">
      <div className="h-6 overflow-hidden">
        <motion.p
          className="text-sm text-gray-300"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-0.5 inline-block h-1 w-2 bg-blue-400"
          />
        </motion.p>
      </div>
    </div>
  );
}

// 水平滚动文字组件
export function HorizontalScrollingText({
  text,
  speed = 50, // 滚动速度，数值越低越快
  className = '',
  paused = false,
}: {
  text: string;
  speed?: number;
  className?: string;
  paused?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap ${className}`}
    >
      {!paused && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{
            duration: (text.length / speed) * 5, // 根据文本长度和速度计算持续时间
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
          className="inline-block whitespace-nowrap"
        >
          {text}
        </motion.div>
      )}
      {paused && <div className="mx-auto text-center">{text}</div>}
    </div>
  );
}
