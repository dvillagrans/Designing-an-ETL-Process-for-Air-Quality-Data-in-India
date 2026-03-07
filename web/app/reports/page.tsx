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

const DATASET_META: Record<string, { desc: string; color: string; dot: string; badge: string }> = {
  city_day: {
    desc: "Mediciones agregadas de calidad del aire por ciudad y día. Incluye PM2.5, PM10, NO₂, SO₂, AQI y AQI_Bucket.",
    color: "text-cyan-400",
    dot: "bg-cyan-400",
    badge: "Diario · Ciudad",
  },
  city_hour: {
    desc: "Mediciones horarias por ciudad. Mayor resolución temporal para análisis de picos de contaminación.",
    color: "text-sky-400",
    dot: "bg-sky-400",
    badge: "Horario · Ciudad",
  },
  station_day: {
    desc: "Registros diarios por estación individual. Permite análisis espacial a nivel estación.",
    color: "text-amber-400",
    dot: "bg-amber-400",
    badge: "Diario · Estación",
  },
  station_hour: {
    desc: "Registros horarios por estación. Mayor granularidad espacio-temporal.",
    color: "text-orange-400",
    dot: "bg-orange-400",
    badge: "Horario · Estación",
  },
  stations: {
    desc: "Catálogo de estaciones de monitoreo con ubicación geográfica, ciudad y estado.",
    color: "text-violet-400",
    dot: "bg-violet-400",
    badge: "Catálogo",
  },
};

export default function ReportsPage() {
  const reports = getReportList();

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-slate-400">
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Informes de calidad
          </div>
          <h1 className="text-3xl font-bold">
            <span className="grad-text-amber">Perfilado</span>
            <span className="text-slate-400 text-2xl font-normal"> de datos — Raw Zone</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Informes HTML generados con{" "}
            <span className="text-slate-300 font-medium">ydata_profiling</span>{" "}
            para cada dataset de la raw zone. Incluyen estadísticas descriptivas, distribuciones,
            valores faltantes y correlaciones.
          </p>
        </div>

        {/* Reports list */}
        {reports.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No hay informes disponibles en <code className="text-cyan-400 font-mono text-xs">public/reports</code>.</p>
            <p className="text-slate-600 text-xs">Ejecuta el script de perfilado y copia los HTML aquí, o usa <code className="text-cyan-400 font-mono text-xs">npm run prebuild</code>.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((name) => {
              const key = name.replace(/_quality_report\.html$/, "").replace(".csv", "");
              const meta = DATASET_META[key];
              return (
                <div
                  key={name}
                  className={`glass rounded-2xl p-5 flex items-start gap-4 border ${meta ? `border-slate-700/40 hover:border-${meta.dot.replace("bg-", "")}/20` : "border-slate-700/40"} transition-all group`}
                >
                  {/* Dot + icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${meta?.dot ?? "bg-slate-500"}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${meta?.color ?? "text-slate-300"}`}>
                        {key.replace(/_/g, "_")}
                      </span>
                      {meta && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border border-current/20 ${meta.color} opacity-70`}>
                          {meta.badge}
                        </span>
                      )}
                    </div>
                    {meta && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{meta.desc}</p>
                    )}
                  </div>

                  {/* Open button */}
                  <a
                    href={`/reports/${name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/15 text-slate-400 hover:text-cyan-400 text-xs font-medium border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Abrir
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Info note */}
        <div className="glass rounded-2xl p-4 flex gap-3 border border-amber-500/15">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p className="text-xs text-slate-500 leading-relaxed">
            Los informes se generan con <span className="text-slate-400">scripts/profile.py</span> usando{" "}
            <span className="text-amber-400/80">ydata_profiling</span> sobre los CSV de la landing zone.
            Los HTML resultantes se copian a <span className="text-slate-400 font-mono">public/reports/</span> vía{" "}
            <span className="text-slate-400 font-mono">npm run prebuild</span>.
          </p>
        </div>

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-400 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}

