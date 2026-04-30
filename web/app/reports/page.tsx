import Link from "next/link";
import { readdirSync } from "fs";
import path from "path";

function getReportList(): string[] {
  try {
    const reportsDir = path.join(process.cwd(), "public", "reports");
    return readdirSync(reportsDir).filter((f) => f.endsWith(".html"));
  } catch {
    return [];
  }
}

const DATASET_META: Record<
  string,
  { desc: string; dot: string; badge: string }
> = {
  city_day: {
    desc: "Mediciones agregadas de calidad del aire por ciudad y dia. Incluye PM2.5, PM10, NO2, SO2, AQI y AQI_Bucket.",
    dot: "#7aad4a",
    badge: "DIARIO · CIUDAD",
  },
  city_hour: {
    desc: "Mediciones horarias por ciudad. Mayor resolucion temporal para analisis de picos de contaminacion.",
    dot: "#c4832a",
    badge: "HORARIO · CIUDAD",
  },
  station_day: {
    desc: "Registros diarios por estacion individual. Permite analisis espacial a nivel estacion.",
    dot: "#e8e4d4",
    badge: "DIARIO · ESTACION",
  },
  station_hour: {
    desc: "Registros horarios por estacion. Mayor granularidad espacio-temporal.",
    dot: "#7a7560",
    badge: "HORARIO · ESTACION",
  },
  stations: {
    desc: "Catalogo de estaciones de monitoreo con ubicacion geografica, ciudad y estado.",
    dot: "#3d3c30",
    badge: "CATALOGO",
  },
};

const cardBase = "border border-[rgba(232,228,212,0.07)] bg-[#0f1009] p-5";
const labelBase =
  "font-mono text-[10px] tracking-widest text-[#3d3c30] uppercase";

export default function ReportsPage() {
  const reports = getReportList();

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <span className="font-mono text-[10px] tracking-widest text-[#7a7560]">
              INFORMES DE CALIDAD
            </span>
          </div>
          <h1 className="font-mono text-lg font-bold text-[#e8e4d4] tracking-widest">
            PERFILADO DE DATOS — RAW ZONE
          </h1>
          <p className="font-mono text-[11px] text-[#7a7560] leading-relaxed tracking-wider">
            Informes HTML generados con{" "}
            <span className="text-[#e8e4d4]">ydata_profiling</span> para cada
            dataset de la raw zone. Incluyen estadisticas descriptivas,
            distribuciones, valores faltantes y correlaciones.
          </p>
        </div>

        {/* Reports list */}
        {reports.length === 0 ? (
          <div className={`${cardBase} text-center space-y-3`}>
            <div className="w-10 h-10 border border-[rgba(232,228,212,0.07)] bg-[#0a0b08] flex items-center justify-center mx-auto">
              <svg
                className="w-5 h-5 text-[#3d3c30]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <p className="font-mono text-[11px] text-[#7a7560] tracking-wider">
              No hay informes disponibles en{" "}
              <code className="text-[#7aad4a] font-mono text-[10px]">
                public/reports
              </code>
              .
            </p>
            <p className="font-mono text-[10px] text-[#3d3c30] tracking-wider">
              Ejecuta el script de perfilado y copia los HTML aqui, o usa{" "}
              <code className="text-[#7aad4a] font-mono text-[10px]">
                npm run prebuild
              </code>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((name) => {
              const key = name
                .replace(/_quality_report\.html$/, "")
                .replace(".csv", "");
              const meta = DATASET_META[key];
              return (
                <div
                  key={name}
                  className={`${cardBase} flex items-start gap-4 group hover:border-[rgba(232,228,212,0.12)] transition-all`}
                >
                  {/* Dot + icon */}
                  <div className="flex-shrink-0 w-9 h-9 border border-[rgba(232,228,212,0.07)] bg-[#0a0b08] flex items-center justify-center">
                    <div
                      className="w-2 h-2"
                      style={{
                        background: meta?.dot ?? "#3d3c30",
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#e8e4d4] tracking-wider">
                        {key.toUpperCase()}
                      </span>
                      {meta && (
                        <span className="font-mono text-[9px] px-2 py-0.5 tracking-widest border border-[rgba(232,228,212,0.07)] text-[#7a7560]">
                          {meta.badge}
                        </span>
                      )}
                    </div>
                    {meta && (
                      <p className="font-mono text-[11px] text-[#3d3c30] mt-1 leading-relaxed tracking-wider">
                        {meta.desc}
                      </p>
                    )}
                  </div>

                  {/* Open button */}
                  <a
                    href={`/reports/${name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[rgba(232,228,212,0.07)] bg-[#0a0b08] text-[#7a7560] hover:text-[#7aad4a] hover:border-[#7aad4a]/25 font-mono text-[10px] tracking-widest transition-all"
                  >
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                    ABRIR
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Info note */}
        <div className={`${cardBase} flex gap-3 border-l-2 border-l-[#c4832a]/30`}>
          <svg
            className="w-4 h-4 text-[#c4832a] flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <p className="font-mono text-[10px] text-[#3d3c30] leading-relaxed tracking-wider">
            Los informes se generan con{" "}
            <span className="text-[#7a7560]">scripts/profile.py</span> usando{" "}
            <span className="text-[#c4832a]">ydata_profiling</span> sobre los
            CSV de la landing zone. Los HTML resultantes se copian a{" "}
            <span className="text-[#7a7560]">public/reports/</span> via{" "}
            <span className="text-[#7a7560]">npm run prebuild</span>.
          </p>
        </div>

        {/* Back */}
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
  );
}
