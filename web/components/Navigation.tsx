'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'DASHBOARD', href: '/dashboard' },
  { label: 'INFORMES', href: '/reports' },
  { label: 'DOCS', href: '/docs' },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerTopRef = useRef<HTMLSpanElement>(null);
  const burgerMidRef = useRef<HTMLSpanElement>(null);
  const burgerBotRef = useRef<HTMLSpanElement>(null);

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

  // Animate burger icon
  useEffect(() => {
    if (!burgerTopRef.current || !burgerMidRef.current || !burgerBotRef.current) return;

    if (menuOpen) {
      gsap.to(burgerTopRef.current, { y: 5, rotation: 45, duration: 0.25, ease: 'power2.out' });
      gsap.to(burgerMidRef.current, { opacity: 0, duration: 0.15 });
      gsap.to(burgerBotRef.current, { y: -5, rotation: -45, duration: 0.25, ease: 'power2.out' });
    } else {
      gsap.to(burgerTopRef.current, { y: 0, rotation: 0, duration: 0.25, ease: 'power2.out' });
      gsap.to(burgerMidRef.current, { opacity: 1, duration: 0.2 });
      gsap.to(burgerBotRef.current, { y: 0, rotation: 0, duration: 0.25, ease: 'power2.out' });
    }
  }, [menuOpen]);

  // Animate mobile menu
  useEffect(() => {
    if (!menuRef.current) return;

    if (menuOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', pointerEvents: 'auto' }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll('.mobile-nav-link'),
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );
    } else {
      gsap.to(menuRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', pointerEvents: 'none' });
    }
  }, [menuOpen]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('.burger-btn')) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

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

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6 sm:gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[11px] tracking-widest text-[#7a7560]
                           hover:text-[#7aad4a] transition-colors"
              >
                {link.label}
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

            {/* Mobile burger button */}
            <button
              className="burger-btn sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] relative z-50"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span ref={burgerTopRef} className="block w-5 h-px bg-[#e8e4d4]" />
              <span ref={burgerMidRef} className="block w-5 h-px bg-[#e8e4d4]" />
              <span ref={burgerBotRef} className="block w-5 h-px bg-[#e8e4d4]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        className="sm:hidden absolute top-full left-0 right-0 border-b border-[rgba(232,228,212,0.07)] opacity-0 pointer-events-none"
        style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(10, 11, 8, 0.95)' }}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-link font-mono text-sm tracking-widest text-[#7a7560]
                         hover:text-[#7aad4a] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://dvillagrans.dev"
            className="mobile-nav-link font-mono text-sm tracking-widest text-[#7a7560]
                       hover:text-[#7aad4a] transition-colors pt-2 border-t border-[rgba(232,228,212,0.07)]"
          >
            ← dvillagrans.dev
          </a>
        </div>
      </div>
    </nav>
  );
}
