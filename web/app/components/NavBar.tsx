"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports",   label: "Informes"  },
  { href: "/docs",      label: "Docs"      },
];

export default function NavBar() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 nav-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
            <svg
              className="relative w-5 h-5 text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight grad-text">AQI India ETL</div>
            <div className="text-[10px] text-slate-500 tracking-widest uppercase">Air Quality Pipeline</div>
          </div>
        </Link>

        {/* Links */}
        <nav className="ml-auto flex items-center gap-0.5">
          {NAV.map(({ href, label }) => {
            const active = path === href || (href !== "/" && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                data-active={active}
                className={`nav-link px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <span className="ml-3 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-cyan-500/25 text-cyan-500/60 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 inline-block animate-pulse" />
            v1.0
          </span>
        </nav>

      </div>
    </header>
  );
}
