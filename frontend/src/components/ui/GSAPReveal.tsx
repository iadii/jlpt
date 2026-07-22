'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface GSAPRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  staggerChildren?: boolean;
}

export function GSAPReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  staggerChildren = false,
}: GSAPRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    let initialX = 0;
    let initialY = 0;

    if (direction === 'up') initialY = 35;
    if (direction === 'down') initialY = -35;
    if (direction === 'left') initialX = 35;
    if (direction === 'right') initialX = -35;

    if (staggerChildren) {
      const targets = el.children;
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: initialY,
          x: initialX,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.7,
          delay: delay,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    } else {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: initialY,
          x: initialX,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.7,
          delay: delay,
          ease: 'power3.out',
        }
      );
    }
  }, [delay, direction, staggerChildren]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
