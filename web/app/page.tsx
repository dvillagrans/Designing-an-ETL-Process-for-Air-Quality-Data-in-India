import Link from "next/link";

const AQI_LEVELS = [
  { label: "Good",         color: "#22c55e", range: "0–50"    },
  { label: "Satisfactory", color: "#84cc16", range: "51–100"  },
  { label: "Moderate",     color: "#eab308", range: "101–200" },
  { label: "Poor",         color: "#f97316", range: "201–300" },
  { label: "Very Poor",    color: "#ef4444", range: "301–400" },
  { label: "Severe",       color: "#7c3aed", range: "401+"    },
];

const PIPELINE = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    phase: "Extract",
    desc: "Descarga de datasets CSV desde Kaggle vía scripts/extract.py",
    badge: "Landing Zone",
    colors: { text: "text-cyan-400", border: "border-cyan-500/25", iconBg: "bg-cyan-500/10" },
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    phase: "Transform",
    desc: "Limpieza, encoding AQI Bucket → numérico, guardado en Parquet con Spark",
    badge: "Refined Zone",
    colors: { text: "text-amber-400", border: "border-amber-500/25", iconBg: "bg-amber-500/10" },
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    phase: "Load",
    desc: "Análisis con Spark, perfilado ydata_profiling y visualización en dashboard",
    badge: "Analytics",
    colors: { text: "text-violet-400", border: "border-violet-500/25", iconBg: "bg-violet-500/10" },
  },
];

const FEATURES = [
  {
    href: "/dashboard",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: "Dashboard AQI",
    desc: "Visualiza la evolución temporal del AQI, distribución por buckets y comparativa entre ciudades con gráficos interactivos.",
    cta: "Explorar datos",
    accent: { text: "text-cyan-400",   border: "border-cyan-500/20",   iconBg: "bg-cyan-500/10"   },
  },
  {
    href: "/reports",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Informes de calidad",
    desc: "Informes detallados de perfilado generados con ydata_profiling para cada dataset de la raw zone.",
    cta: "Ver informes",
    accent: { text: "text-amber-400",  border: "border-amber-500/20",  iconBg: "bg-amber-500/10"  },
  },
  {
    href: "/docs",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Documentación",
    desc: "Arquitectura del pipeline ETL, esquema de datos, zonas de aterrizaje y descripción detallada de cada etapa.",
    cta: "Leer docs",
    accent: { text: "text-violet-400", border: "border-violet-500/20", iconBg: "bg-violet-500/10" },
  },
];

const STATS = [
  { value: "5",      label: "Datasets",   sub: "CSV de Kaggle"    },
  { value: "26",     label: "Ciudades",   sub: "en India"         },
  { value: "6 años", label: "Cobertura",  sub: "2015 – 2020"      },
  { value: "1M+",    label: "Registros",  sub: "estación / hora"  },
];

export default function Home() {
  return (
    <div className="relative">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
        {/* Inner radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">

          {/* Eyebrow badge */}
          <div className="fiu flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
              Proyecto ETL · Ingeniería de Datos · India
            </span>
          </div>

          {/* Title */}
          <div className="fiu-2 space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="grad-text">Air Quality</span>
              <br />
              <span className="text-slate-200">ETL </span>
              <span className="grad-text-amber">India</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Pipeline end-to-end para procesamiento de datos de calidad del aire.
              Extracción, transformación y carga de más de{" "}
              <strong className="text-slate-300 font-semibold">1 millón de registros</strong>{" "}
              de estaciones a lo largo de India.
            </p>
          </div>

          {/* AQI scale */}
          <div className="fiu-3 space-y-2">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest">Escala AQI — Índice de Calidad del Aire</p>
            <div className="aqi-bar h-2.5 w-full max-w-sm mx-auto rounded-full" />
            <div className="flex justify-between max-w-sm mx-auto px-1">
              {AQI_LEVELS.map(({ label, color, range }) => (
                <div key={label} className="flex flex-col items-center gap-1 group">
                  <div className="w-2 h-2 rounded-full ring-2 ring-transparent group-hover:ring-white/20 transition-all"
                    style={{ background: color }} />
                  <span className="text-[9px] text-slate-600 hidden sm:block">{range}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-sm mx-auto px-1">
              {AQI_LEVELS.map(({ label, color }) => (
                <span key={label} className="text-[9px] font-medium hidden sm:block" style={{ color }}>{label}</span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="fiu-4 flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm transition-all hover:shadow-xl hover:shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              Ver Dashboard
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-slate-300 font-medium text-sm hover:text-white transition-all hover:-translate-y-0.5"
            >
              Informes de calidad
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-slate-300 font-medium text-sm hover:text-white transition-all hover:-translate-y-0.5"
            >
              Documentación
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ value, label, sub }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold grad-text">{value}</div>
              <div className="text-sm font-semibold text-slate-300 mt-1">{label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ETL PIPELINE ───────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">Arquitectura</p>
            <h2 className="text-2xl font-bold text-slate-200">Pipeline ETL</h2>
            <p className="text-slate-500 text-sm mt-1">Tres etapas para transformar datos crudos en insights</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0">
            {PIPELINE.map((step, i) => (
              <div key={step.phase} className="flex flex-col sm:flex-row items-center sm:flex-1 gap-3">
                <div className={`glass rounded-2xl p-6 w-full flex flex-col items-center text-center gap-3 border ${step.colors.border}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.colors.iconBg} ${step.colors.text}`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className={`text-base font-bold ${step.colors.text}`}>{step.phase}</div>
                    <div className="text-xs text-slate-500 leading-relaxed mt-1">{step.desc}</div>
                  </div>
                  <span className={`inline-flex text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${step.colors.text} ${step.colors.border}`}>
                    {step.badge}
                  </span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="flex sm:flex-col items-center justify-center w-10 shrink-0 py-2 sm:py-0">
                    <span className="text-slate-600 text-lg flow-anim select-none">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ──────────────────────────────────────── */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">Secciones</p>
            <h2 className="text-2xl font-bold text-slate-200">Explora el proyecto</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map(({ href, icon, title, desc, cta, accent }) => (
              <Link
                key={href}
                href={href}
                className={`glass group rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 border ${accent.border}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.iconBg} ${accent.text}`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-200 mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-medium ${accent.text} group-hover:gap-2.5 transition-all`}>
                  {cta}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

