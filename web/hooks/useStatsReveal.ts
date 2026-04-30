'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';

export function useStatsReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const statEls = el.querySelectorAll('.stat-value');

      gsap.from(statEls, {
        opacity: 0, y: 30,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        }
      });

      // Counter animation for numeric stats
      statEls.forEach((statEl) => {
        const targetText = statEl.getAttribute('data-value');
        if (!targetText) return;
        const numericMatch = targetText.match(/[\d,]+/);
        if (!numericMatch) return;
        const target = parseInt(numericMatch[0].replace(/,/g, ''), 10);
        if (isNaN(target)) return;

        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 2.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            once: true,
          },
          onUpdate: () => {
            statEl.textContent = Math.round(counter.value).toLocaleString() + targetText.replace(/[\d,]+/, '');
          }
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}
