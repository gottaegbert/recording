'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GridLayoutProps {
  children: ReactNode;
  className?: string;
  container?: boolean;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
}

export function GridLayout({
  children,
  className,
  container = true,
  columns = 12,
  gap = 'md',
  align = 'start',
}: GridLayoutProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  if (container) {
    return (
      <div className={cn('mx-auto max-w-7xl px-6', className)}>
        <div
          className={cn(
            'grid',
            `grid-cols-${columns}`,
            gapClasses[gap],
            alignClasses[align],
            className,
          )}
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${columns}`,
        gapClasses[gap],
        alignClasses[align],
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}

interface GridItemProps {
  children: ReactNode;
  className?: string;
  span?: number;
  start?: number;
  end?: number;
}

export function GridItem({
  children,
  className,
  span = 1,
  start,
  end,
}: GridItemProps) {
  const gridClasses = [];

  if (start) {
    gridClasses.push(`col-start-${start}`);
  }
  if (end) {
    gridClasses.push(`col-end-${end}`);
  } else if (span) {
    gridClasses.push(`col-span-${span}`);
  }

  return <div className={cn(...gridClasses, className)}>{children}</div>;
}
