'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function SakuraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const count = 15; // Floating petals count

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal pointer-events-none fixed z-0 rounded-full opacity-40 blur-[0.5px]';
      
      // Randomize pastel color
      const colors = ['#FFB5A7', '#FF758F', '#F72585', '#E8E8E4'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const size = Math.random() * 12 + 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.4}px`;
      petal.style.backgroundColor = color;
      petal.style.borderRadius = '50% 0 50% 50%';
      petal.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      container.appendChild(petal);

      // GSAP Floating petal animation
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;

      gsap.set(petal, {
        x: startX,
        y: -30,
        rotation: Math.random() * 360,
      });

      gsap.to(petal, {
        y: window.innerHeight + 50,
        x: startX + (Math.random() * 200 - 100),
        rotation: '+=720',
        opacity: 0,
        duration: duration,
        delay: delay,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true" />;
}
