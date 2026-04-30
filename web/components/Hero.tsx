'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations';
import Link from 'next/link';

const AQI_LEVELS = [
  { color: '#4ade80', range: '0–50', label: 'Good' },
  { color: '#a3e635', range: '51–100', label: 'Satisfactory' },
  { color: '#facc15', range: '101–200', label: 'Moderate' },
  { color: '#fb923c', range: '201–300', label: 'Poor' },
  { color: '#f87171', range: '301–400', label: 'Very Poor' },
  { color: '#c084fc', range: '401+', label: 'Severe' },
];

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.from('.hero-coords', {
        opacity: 0, duration: 0.3, ease: 'none'
      });

      tl.from('.hero-title', {
        opacity: 0,
        duration: 0.05,
        ease: 'none',
        repeat: 3,
        yoyo: true,
      });

      tl.to('.hero-title', {
        opacity: 1, duration: 0.1, ease: 'none'
      });

      tl.from('.hero-divider', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        ease: 'power2.inOut'
      }, '-=0.1');

      tl.from('.hero-desc', {
        opacity: 0, y: 12,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2');

      tl.from('.hero-cta', {
        opacity: 0, x: -10,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2');

      tl.from('.aqi-scale-item', {
        opacity: 0, x: 10,
        stagger: 0.06,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.5');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 pt-28 pb-16 px-6 sm:px-12">
      {/* Columna izquierda */}
      <div className="flex flex-col justify-end">
        <span className="hero-coords font-mono text-xs text-[#7aad4a] mb-6 tracking-widest block">
          20.59°N · 78.96°E · INDIA
        </span>

        <h1
          className="hero-title font-display uppercase text-[#e8e4d4]"
          style={{
            fontSize: 'clamp(72px, 12vw, 160px)',
            lineHeight: 0.88,
            letterSpacing: '0.02em',
          }}
        >
          AIR<br />QUALITY<br />
          <span style={{ color: '#7aad4a' }}>ETL</span>
        </h1>

        <div className="flex items-center gap-3 mt-4 mb-8">
          <div className="hero-divider h-px w-12 bg-[#4a6b2a]" />
          <span className="font-mono text-xs text-[#7a7560] tracking-[0.2em]">
            INDIA · 2015–2020 · 1M+ REGISTROS
          </span>
        </div>

        <p className="hero-desc font-ui font-light text-base text-[#7a7560] max-w-md leading-relaxed mb-10">
          Pipeline end-to-end para análisis de calidad del aire.
          26 ciudades. 6 años de datos atmosféricos.
        </p>

        <div className="flex gap-4 flex-wrap">
          <Link href="/dashboard"
             className="hero-cta font-mono text-sm px-5 py-2.5 border border-[rgba(122,173,74,0.2)]
                        text-[#7aad4a] hover:bg-[rgba(122,173,74,0.08)] transition-colors">
            → VER DASHBOARD
          </Link>
          <Link href="/docs"
             className="hero-cta font-mono text-sm px-5 py-2.5 text-[#7a7560]
                        hover:text-[#e8e4d4] transition-colors">
            DOCUMENTACIÓN
          </Link>
        </div>
      </div>

      {/* Columna derecha: panel AQI */}
      <div className="hidden lg:flex border-l border-[rgba(232,228,212,0.07)] pl-8 flex-col justify-between py-8">
        <div>
          <span className="font-mono text-[10px] text-[#3d3c30] tracking-widest block mb-6">
            ESCALA AQI
          </span>
          {AQI_LEVELS.map(({ range, label, color }) => (
            <div key={label} className="aqi-scale-item flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-none" style={{ background: color }} />
              <div>
                <span className="font-mono text-[10px] block" style={{ color }}>
                  {range}
                </span>
                <span className="font-mono text-[11px] text-[#7a7560]">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <span className="font-mono text-[10px] text-[#3d3c30] block">
            COBERTURA GEOGRÁFICA
          </span>
          <span className="font-mono text-[11px] text-[#7a7560] block mt-1">
            20.59°N 78.96°E
          </span>
          <span className="font-mono text-[10px] text-[#3d3c30] block mt-1">
            Centro geográfico · India
          </span>
        </div>
      </div>
    </section>
  );
}
