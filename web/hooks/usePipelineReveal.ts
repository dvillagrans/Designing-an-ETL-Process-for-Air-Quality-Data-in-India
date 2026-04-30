'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';

export function usePipelineReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.pipeline-diagram'), {
        y: 50, opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
        }
      });

      gsap.from(el.querySelectorAll('.pipeline-legend-item'), {
        x: -20, opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 65%',
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}
