'use client';

import React, { useEffect, useRef, useState } from 'react';

type AnimationVariant = 'fadeInUp' | 'fadeInLeft' | 'zoomIn';

interface RevealProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delayMs?: number;
  className?: string;
}

export function Reveal({
  children,
  variant = 'fadeInUp',
  delayMs = 0,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initialTransform =
    variant === 'fadeInUp'
      ? 'translate3d(0, 28px, 0)'
      : variant === 'fadeInLeft'
      ? 'translate3d(-28px, 0, 0)'
      : 'scale(0.88)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : initialTransform,
        transition: `opacity 750ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 750ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
