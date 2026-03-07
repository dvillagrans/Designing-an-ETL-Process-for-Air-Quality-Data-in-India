import Link from "next/link";

const ZONES = [
  {
    name: "Landing Zone",
    path: "data/landing-zone",
    desc: "Archivos CSV descargados directamente de Kaggle mediante scripts/extract.py.",
    color: "text-cyan-400",
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/8",
    dot: "bg-cyan-400",
  },
  {
    name: "Raw Zone",
    path: "data/raw-zone",
    desc: "Informes de calidad generados con ydata_profiling; los HTML se guardan en data/raw-zone/data_quality_reports.",
    color: "text-amber-400",
    border: "border-amber-500/25",
    bg: "bg-amber-500/8",
    dot: "bg-amber-400",
  },
  {
    name: "Refined Zone",
    path: "data/refined-zone",
    desc: "Datos transformados, AQI_Bucket codificado numéricamente y guardados en Parquet. Incluye aqi_bucket_mapping.json.",
    color: "text-violet-400",
    border: "border-violet-500/25",
    bg: "bg-violet-500/8",
    dot: "bg-violet-400",
  },
];

const DATASETS = [
  { name: "city_day",     desc: "Mediciones agregadas por ciudad y día — PM2.5, PM10, NO₂, SO₂, CO, O₃, AQI, AQI_Bucket." },
  { name: "city_hour",    desc: "Mediciones agregadas por ciudad y hora." },
  { name: "station_day",  desc: "Mediciones por estación individual y día." },
  { name: "station_hour", desc: "Mediciones por estación individual y hora." },
  { name: "stations",     desc: "Catálogo de estaciones: nombre, ciudad, estado, latitud, longitud." },
];

const RESOURCES = [
  { label: "notebooks/etl_pipeline.ipynb",      desc: "Lectura y procesamiento de datos con Apache Spark." },
  { label: "notebooks/data_transformation.ipynb", desc: "Transformaciones, encoding y guardado en Parquet." },
  { label: "scripts/extract.py",                desc: "Descarga del dataset desde Kaggle API." },
  { label: "scripts/profile.py",               desc: "Generación de informes de calidad con ydata_profiling." },
  { label: "scripts/transform.py",             desc: "Pipeline de limpieza y transformación." },
  { label: "scripts/load.py",                  desc: "Carga de datos transformados." },
];

const AQI_BUCKETS = [
  { label: "Good",         range: "0–50",     color: "#22c55e" },
  { label: "Satisfactory", range: "51–100",   color: "#84cc16" },
  { label: "Moderate",     range: "101–200",  color: "#eab308" },
  { label: "Poor",         range: "201–300",  color: "#f97316" },
  { label: "Very Poor",    range: "301–400",  color: "#ef4444" },
  { label: "Severe",       range: "401+",     color: "#7c3aed" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-0.5 h-5 rounded-full bg-cyan-400/60" />
        <h2 className="text-lg font-bold text-slate-200">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="inline-flex px-1.5 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 text-[12px] font-mono border border-slate-700/50">
      {children}
    </code>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-slate-400">
            <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            Documentación
          </div>
          <h1 className="text-3xl font-bold">
            <span className="grad-text">Pipeline ETL</span>
            <span className="text-slate-400 text-2xl font-normal"> — Calidad del Aire en India</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Pipeline end-to-end para procesar el dataset{" "}
            <a
              href="https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              Air Quality Data in India (Kaggle)
            </a>.
            Los datos se procesan en zonas progresivas hasta generar análisis y visualizaciones.
          </p>
        </div>

        {/* Objetivo */}
        <Section title="Objetivo">
          <div className="glass rounded-2xl p-5 text-slate-400 leading-relaxed text-sm">
            Diseñar e implementar un pipeline ETL completo para datos de calidad del aire en India,
            desde la ingesta de archivos CSV crudos hasta la transformación, codificación y carga
            en formato Parquet para análisis posterior con Apache Spark y visualización en dashboard.
          </div>
        </Section>

        {/* Zonas de datos */}
        <Section title="Arquitectura por zonas">
          <div className="space-y-3">
            {ZONES.map((z, i) => (
              <div key={z.name} className={`glass rounded-2xl p-5 border ${z.border} flex gap-4`}>
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${z.dot}`} />
                  {i < ZONES.length - 1 && <div className="w-px flex-1 bg-slate-700/50" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${z.color}`}>{z.name}</span>
                    <Code>{z.path}</Code>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{z.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Datasets */}
        <Section title="Esquema de datos">
          <div className="glass rounded-2xl overflow-hidden">
            {DATASETS.map((d, i) => (
              <div key={d.name} className={`flex items-start gap-3 px-5 py-3.5 ${i < DATASETS.length - 1 ? "border-b border-slate-700/30" : ""}`}>
                <Code>{d.name}</Code>
                <p className="text-sm text-slate-500 leading-relaxed pt-0.5">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-slate-300">Clasificación AQI_Bucket</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AQI_BUCKETS.map(({ label, range, color }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="font-medium" style={{ color }}>{label}</span>
                  <span className="text-slate-600">{range}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              El archivo <Code>data/refined-zone/aqi_bucket_mapping.json</Code> mapea cada etiqueta a un código numérico para ML.
            </p>
          </div>
        </Section>

        {/* Recursos */}
        <Section title="Recursos del repositorio">
          <div className="glass rounded-2xl overflow-hidden">
            {RESOURCES.map((r, i) => (
              <div key={r.label} className={`flex items-start gap-3 px-5 py-3.5 ${i < RESOURCES.length - 1 ? "border-b border-slate-700/30" : ""}`}>
                <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <div>
                  <Code>{r.label}</Code>
                  <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Back link */}
        <div className="pt-2 flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-400 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}

