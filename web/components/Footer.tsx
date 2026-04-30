import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(232,228,212,0.07)] mt-0">

      <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 py-3
                      border-b border-[rgba(232,228,212,0.07)] bg-[#0f1009] gap-2">
        <span className="font-mono text-[10px] text-[#3d3c30] tracking-widest">
          INDIA AIR QUALITY PIPELINE · v1.0.0
        </span>
        <span className="font-mono text-[10px] text-[#3d3c30]">
          Dataset: Air Quality Data in India · Kaggle · CC0
        </span>
        <span className="font-mono text-[10px] text-[#3d3c30]">
          26 ciudades · 2015–2020 · 1,067,371 registros
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-0 px-6 sm:px-12 py-10">

        <div className="sm:pr-12 sm:border-r border-b sm:border-b-0 border-[rgba(232,228,212,0.07)] pb-8 sm:pb-0 mb-8 sm:mb-0">
          <span className="font-mono text-xs font-bold text-[#e8e4d4] tracking-widest block mb-3">
            INDIA AIR
          </span>
          <p className="font-ui font-light text-sm text-[#7a7560] leading-relaxed max-w-xs">
            Pipeline ETL para análisis de calidad del aire en India.
            Proyecto académico de ingeniería de datos.
          </p>
        </div>

        <div className="sm:px-12 sm:border-r border-b sm:border-b-0 border-[rgba(232,228,212,0.07)] pb-8 sm:pb-0 mb-8 sm:mb-0">
          <span className="font-mono text-[10px] text-[#3d3c30] tracking-widest block mb-4">
            NAVEGACION
          </span>
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Informes de calidad', href: '/reports' },
            { label: 'Documentacion', href: '/docs' }
          ].map(({ label, href }) => (
            <Link key={label} href={href}
               className="font-ui font-light text-sm text-[#7a7560]
                          hover:text-[#7aad4a] transition-colors block mb-2.5">
              {label}
            </Link>
          ))}
        </div>

        <div className="sm:pl-12">
          <span className="font-mono text-[10px] text-[#3d3c30] tracking-widest block mb-4">
            AUTOR
          </span>
          <span className="font-mono text-sm font-bold text-[#e8e4d4] block mb-1">
            Diego Villagran
          </span>
          <span className="font-ui font-light text-xs text-[#7a7560] block mb-4">
            Data Science · ESCOM-IPN · Mexico
          </span>
          <a href="https://dvillagrans.dev"
             className="font-mono text-xs text-[#7aad4a]
                        hover:text-[#e8e4d4] transition-colors">
            ← PORTFOLIO COMPLETO
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 py-3
                      border-t border-[rgba(232,228,212,0.07)] gap-2">
        <span className="font-mono text-[10px] text-[#3d3c30]">
          © 2025 · Proyecto academico con fines de investigacion
        </span>
        <span className="font-mono text-[10px] text-[#3d3c30]">
          20.59°N 78.96°E · India
        </span>
      </div>
    </footer>
  );
}
