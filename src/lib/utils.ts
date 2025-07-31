import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Grid utility functions
export function gridSpan(span: number, breakpoint?: 'sm' | 'md' | 'lg' | 'xl') {
  if (breakpoint) {
    return `${breakpoint}:col-span-${span}`;
  }
  return `col-span-${span}`;
}

export function gridStart(
  start: number,
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl',
) {
  if (breakpoint) {
    return `${breakpoint}:col-start-${start}`;
  }
  return `col-start-${start}`;
}

export function gridEnd(end: number, breakpoint?: 'sm' | 'md' | 'lg' | 'xl') {
  if (breakpoint) {
    return `${breakpoint}:col-end-${end}`;
  }
  return `col-end-${end}`;
}

export function gridResponsive(
  mobile: number,
  tablet?: number,
  desktop?: number,
) {
  const classes = [`col-span-${mobile}`];

  if (tablet) {
    classes.push(`md:col-span-${tablet}`);
  }

  if (desktop) {
    classes.push(`lg:col-span-${desktop}`);
  }

  return classes.join(' ');
}
