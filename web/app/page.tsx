'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/Hero';
import { usePipelineReveal } from '@/hooks/usePipelineReveal';
import { usePanelsReveal } from '@/hooks/usePanelsReveal';
import { useStatsReveal } from '@/hooks/useStatsReveal';
import Link from 'next/link';

const ETLPipelineFlow = dynamic(
  () => import('@/components/ETLPipelineFlow').then((mod) => mod.ETLPipelineFlow),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] animate-pulse bg-[rgba(232,228,212,0.02)]" />
    ),
  }
);

const SECTIONS = [
  {
    id: '01',
    label: 'DASHBOARD AQI',
    href: '/dashboard',
    desc: 'Evolución temporal del AQI, distribución por buckets y comparativa entre ciudades con gráficos interactivos.',
    tag: 'VISUALIZACION',
  },
  {
    id: '02',
    label: 'INFORMES DE CALIDAD',
    href: '/reports',
    desc: 'Informes detallados de perfilado generados con ydata_profiling para cada dataset de la raw zone.',
    tag: 'ANALISIS',
  },
  {
    id: '03',
    label: 'DOCUMENTACION',
    href: '/docs',
    desc: 'Arquitectura del pipeline ETL, esquema de datos, zonas de aterrizaje y descripción detallada de cada etapa.',
    tag: 'REFERENCIA',
  },
];

export default function Home() {
  const pipelineRef = usePipelineReveal();
  const panelsRef = usePanelsReveal();
  const statsRef = useStatsReveal();

  return (
    <div className="relative">

      <Hero />

      {/* Stats Section */}
      <section ref={statsRef} className="px-6 sm:px-12 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[rgba(232,228,212,0.07)]">
          <div className="bg-[#0a0b08] p-8">
            <span className="stat-value font-mono text-6xl font-bold text-[#e8e4d4] block" data-value="1M+">
              0
            </span>
            <span className="font-mono text-xs text-[#7aad4a] tracking-widest block mt-2">
              REGISTROS
            </span>
            <span className="font-ui font-light text-sm text-[#7a7560] block mt-1">
              estación / hora
            </span>
          </div>
          {[
            { value: '26', label: 'CIUDADES', sub: 'en India' },
            { value: '6', label: 'AÑOS', sub: '2015–2020' },
            { value: '5', label: 'DATASETS', sub: 'CSV de Kaggle' },
          ].map(({ value, label, sub }) => (
            <div key={label} className="bg-[#0a0b08] p-6">
              <span className="stat-value font-mono text-4xl font-bold text-[#e8e4d4] block" data-value={value}>
                0
              </span>
              <span className="font-mono text-[10px] text-[#7aad4a] tracking-widest block mt-2">
                {label}
              </span>
              <span className="font-ui font-light text-xs text-[#7a7560] block mt-1">
                {sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline Section */}
      <section ref={pipelineRef} id="arquitectura" className="py-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#4a6b2a]" />
            <span className="font-mono text-xs tracking-widest text-[#7aad4a]">
              ARQUITECTURA
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl text-[#e8e4d4] mb-2 uppercase tracking-wide">
            Pipeline ETL
          </h2>
          <p className="font-ui font-light text-[#7a7560] mb-10 max-w-lg">
            Tres etapas para transformar datos crudos en insights analíticos.
          </p>

          <div className="pipeline-diagram border border-[rgba(232,228,212,0.07)]">
            <ETLPipelineFlow />
          </div>

          <div className="flex items-center gap-6 mt-4 pl-2 flex-wrap">
            {[
              { color: '#7aad4a', label: 'Landing Zone' },
              { color: '#c4832a', label: 'Refined Zone' },
              { color: '#e8e4d4', label: 'Analytics' },
            ].map(({ color, label }) => (
              <div key={label} className="pipeline-legend-item flex items-center gap-2">
                <div className="w-2 h-2 rounded-none" style={{ background: color }} />
                <span className="font-mono text-[11px] text-[#7a7560]">{label}</span>
              </div>
            ))}
            <span className="ml-auto font-mono text-[11px] text-[#3d3c30] hidden sm:block">
              Interactivo — arrastra para explorar
            </span>
          </div>
        </div>
      </section>

      {/* Explore Section — horizontal panels */}
      <section ref={panelsRef} className="border-t border-[rgba(232,228,212,0.07)] mt-16">
        <div className="px-6 sm:px-12 py-10 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#4a6b2a]" />
            <span className="font-mono text-xs tracking-widest text-[#7aad4a]">
              SECCIONES
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-[#e8e4d4] uppercase tracking-wide">
            Explora el proyecto
          </h2>
        </div>

        {SECTIONS.map(({ id, label, href, desc, tag }) => (
          <Link
            key={id}
            href={href}
            className="section-panel flex flex-col sm:flex-row items-start sm:items-center justify-between
                       px-6 sm:px-12 py-8 border-b border-[rgba(232,228,212,0.07)] group
                       hover:bg-[rgba(122,173,74,0.04)] transition-colors duration-200"
          >
            <span className="font-mono text-[11px] text-[#3d3c30] w-12 shrink-0 mb-2 sm:mb-0">
              {id}
            </span>

            <span className="font-mono text-sm font-bold text-[#e8e4d4]
                             group-hover:text-[#7aad4a] transition-colors flex-1 mb-2 sm:mb-0">
              {label}
            </span>

            <p className="font-ui font-light text-sm text-[#7a7560]
                          max-w-sm opacity-60 group-hover:opacity-100 transition-opacity mb-3 sm:mb-0">
              {desc}
            </p>

            <div className="flex items-center gap-4 w-auto sm:w-48 justify-start sm:justify-end shrink-0">
              <span className="font-mono text-[10px] text-[#3d3c30] tracking-widest">
                {tag}
              </span>
              <span className="font-mono text-[#7aad4a] opacity-0
                               group-hover:opacity-100 group-hover:translate-x-1
                               transition-all duration-200">
                →
              </span>
            </div>
          </Link>
        ))}
      </section>

    </div>
  );
}
