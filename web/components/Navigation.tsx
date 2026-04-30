'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';
import Link from 'next/link';

export function Navigation() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.nav-progress', {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        }
      });

      ScrollTrigger.create({
        start: 'top -60px',
        onToggle: (self) => {
          gsap.to('.nav-container', {
            backdropFilter: self.isActive ? 'blur(8px)' : 'blur(0px)',
            backgroundColor: self.isActive
              ? 'rgba(10, 11, 8, 0.9)'
              : 'transparent',
            duration: 0.3,
          });
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(232,228,212,0.07)]">
      <div
        className="nav-progress h-px bg-[#7aad4a] origin-left scale-x-0"
        style={{ transformOrigin: 'left center' }}
      />
      <div className="nav-container px-6 sm:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <Link href="/" className="shrink-0">
            <span className="font-mono text-xs font-bold text-[#e8e4d4] tracking-widest block">
              INDIA AIR
            </span>
            <span className="font-mono text-[10px] text-[#3d3c30] block tracking-widest">
              QUALITY PIPELINE
            </span>
          </Link>

          <div className="flex items-center gap-6 sm:gap-8">
            {['DASHBOARD', 'INFORMES', 'DOCS'].map(link => (
              <Link
                key={link}
                href={`/${link === 'DASHBOARD' ? 'dashboard' : link === 'INFORMES' ? 'reports' : 'docs'}`}
                className="font-mono text-[11px] tracking-widest text-[#7a7560]
                           hover:text-[#7aad4a] transition-colors hidden sm:block"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <span className="font-mono text-[10px] text-[#3d3c30] hidden md:block">
              20.59°N · 78.96°E
            </span>
            <a
              href="https://dvillagrans.dev"
              className="font-mono text-[10px] text-[#3d3c30]
                         hover:text-[#7aad4a] transition-colors"
            >
              ← dvillagrans.dev
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
