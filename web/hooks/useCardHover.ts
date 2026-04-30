'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';

export function useCardHover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.section-card'), {
        y: 40, opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el.querySelector('.explore-grid'),
          start: 'top 80%',
        }
      });

      el.querySelectorAll('.section-card').forEach(card => {
        const arrow = card.querySelector('.card-arrow');

        card.addEventListener('mouseenter', () => {
          if (arrow) gsap.to(arrow, { x: 4, duration: 0.2, ease: 'power2.out' });
          gsap.to(card, {
            borderColor: 'rgba(59, 130, 246, 0.25)',
            duration: 0.2
          });
        });

        card.addEventListener('mouseleave', () => {
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.inOut' });
          gsap.to(card, {
            borderColor: 'rgba(240, 246, 252, 0.08)',
            duration: 0.3
          });
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}
