import Link from "next/link";

const ZONES = [
  {
    name: "Landing Zone",
    path: "data/landing-zone",
    desc: "Archivos CSV descargados directamente de Kaggle mediante scripts/extract.py.",
    dot: "#7aad4a",
  },
  {
    name: "Raw Zone",
    path: "data/raw-zone",
    desc: "Informes de calidad generados con ydata_profiling; los HTML se guardan en data/raw-zone/data_quality_reports.",
    dot: "#c4832a",
  },
  {
    name: "Refined Zone",
    path: "data/refined-zone",
    desc: "Datos transformados, AQI_Bucket codificado numericamente y guardados en Parquet. Incluye aqi_bucket_mapping.json.",
    dot: "#e8e4d4",
  },
];

const DATASETS = [
  {
    name: "city_day",
    desc: "Mediciones agregadas por ciudad y dia — PM2.5, PM10, NO2, SO2, CO, O3, AQI, AQI_Bucket.",
  },
  {
    name: "city_hour",
    desc: "Mediciones agregadas por ciudad y hora.",
  },
  {
    name: "station_day",
    desc: "Mediciones por estacion individual y dia.",
  },
  {
    name: "station_hour",
    desc: "Mediciones por estacion individual y hora.",
  },
  {
    name: "stations",
    desc: "Catalogo de estaciones: nombre, ciudad, estado, latitud, longitud.",
  },
];

const RESOURCES = [
  {
    label: "notebooks/etl_pipeline.ipynb",
    desc: "Lectura y procesamiento de datos con Apache Spark.",
  },
  {
    label: "notebooks/data_transformation.ipynb",
    desc: "Transformaciones, encoding y guardado en Parquet.",
  },
  { label: "scripts/extract.py", desc: "Descarga del dataset desde Kaggle API." },
  {
    label: "scripts/profile.py",
    desc: "Generacion de informes de calidad con ydata_profiling.",
  },
  { label: "scripts/transform.py", desc: "Pipeline de limpieza y transformacion." },
  { label: "scripts/load.py", desc: "Carga de datos transformados." },
];

const AQI_BUCKETS = [
  { label: "Good", range: "0-50", color: "#4ade80" },
  { label: "Satisfactory", range: "51-100", color: "#a3e635" },
  { label: "Moderate", range: "101-200", color: "#facc15" },
  { label: "Poor", range: "201-300", color: "#fb923c" },
  { label: "Very Poor", range: "301-400", color: "#f87171" },
  { label: "Severe", range: "401+", color: "#c084fc" },
];

const cardBase = "border border-[rgba(232,228,212,0.07)] bg-[#0f1009]";
const labelBase =
  "font-mono text-[10px] tracking-widest text-[#3d3c30] uppercase";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-px h-5 bg-[#7aad4a]/60" />
        <h2 className="font-mono text-sm font-bold text-[#e8e4d4] tracking-widest">
          {title.toUpperCase()}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="inline-flex px-1.5 py-0.5 bg-[#0a0b08] text-[#7aad4a] text-[11px] font-mono border border-[rgba(232,228,212,0.07)] tracking-wider">
      {children}
    </code>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[rgba(232,228,212,0.07)] bg-[#0f1009]">
            <svg
              className="w-3.5 h-3.5 text-[#7aad4a]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="font-mono text-[10px] tracking-widest text-[#7a7560]">
              DOCUMENTACION
            </span>
          </div>
          <h1 className="font-mono text-lg font-bold text-[#e8e4d4] tracking-widest">
            PIPELINE ETL — CALIDAD DEL AIRE EN INDIA
          </h1>
          <p className="font-mono text-[11px] text-[#7a7560] leading-relaxed tracking-wider">
            Pipeline end-to-end para procesar el dataset{" "}
            <a
              href="https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7aad4a] hover:text-[#e8e4d4] underline underline-offset-2 transition-colors"
            >
              Air Quality Data in India (Kaggle)
            </a>
            . Los datos se procesan en zonas progresivas hasta generar analisis
            y visualizaciones.
          </p>
        </div>

        {/* Objetivo */}
        <Section title="Objetivo">
          <div className={`${cardBase} p-5 font-mono text-[11px] text-[#7a7560] leading-relaxed tracking-wider`}>
            Disenar e implementar un pipeline ETL completo para datos de
            calidad del aire en India, desde la ingesta de archivos CSV crudos
            hasta la transformacion, codificacion y carga en formato Parquet
            para analisis posterior con Apache Spark y visualizacion en
            dashboard.
          </div>
        </Section>

        {/* Zonas de datos */}
        <Section title="Arquitectura por zonas">
          <div className="space-y-3">
            {ZONES.map((z, i) => (
              <div
                key={z.name}
                className={`${cardBase} p-5 flex gap-4`}
              >
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div
                    className="w-2 h-2 flex-shrink-0"
                    style={{ background: z.dot }}
                  />
                  {i < ZONES.length - 1 && (
                    <div className="w-px flex-1 bg-[rgba(232,228,212,0.07)]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#e8e4d4] tracking-wider">
                      {z.name.toUpperCase()}
                    </span>
                    <Code>{z.path}</Code>
                  </div>
                  <p className="font-mono text-[11px] text-[#3d3c30] leading-relaxed tracking-wider">
                    {z.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Datasets */}
        <Section title="Esquema de datos">
          <div className={`${cardBase} overflow-hidden`}>
            {DATASETS.map((d, i) => (
              <div
                key={d.name}
                className={`flex items-start gap-3 px-5 py-3.5 ${
                  i < DATASETS.length - 1
                    ? "border-b border-[rgba(232,228,212,0.05)]"
                    : ""
                }`}
              >
                <Code>{d.name}</Code>
                <p className="font-mono text-[11px] text-[#3d3c30] leading-relaxed tracking-wider pt-0.5">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`${cardBase} p-5 space-y-3`}>
            <p className="font-mono text-[11px] font-bold text-[#e8e4d4] tracking-widest">
              CLASIFICACION AQI_BUCKET
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AQI_BUCKETS.map(({ label, range, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 font-mono text-[10px] text-[#3d3c30] tracking-wider"
                >
                  <span
                    className="w-2 h-2 flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="font-medium" style={{ color }}>
                    {label.toUpperCase()}
                  </span>
                  <span className="text-[#3d3c30]">{range}</span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] text-[#3d3c30] tracking-wider">
              El archivo{" "}
              <Code>data/refined-zone/aqi_bucket_mapping.json</Code> mapea cada
              etiqueta a un codigo numerico para ML.
            </p>
          </div>
        </Section>

        {/* Recursos */}
        <Section title="Recursos del repositorio">
          <div className={`${cardBase} overflow-hidden`}>
            {RESOURCES.map((r, i) => (
              <div
                key={r.label}
                className={`flex items-start gap-3 px-5 py-3.5 ${
                  i < RESOURCES.length - 1
                    ? "border-b border-[rgba(232,228,212,0.05)]"
                    : ""
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 text-[#3d3c30] flex-shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <div>
                  <Code>{r.label}</Code>
                  <p className="font-mono text-[10px] text-[#3d3c30] mt-1 tracking-wider">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Back link */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#3d3c30] hover:text-[#7aad4a] transition-colors tracking-widest"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  );
}
