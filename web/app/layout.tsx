import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "./components/NavBar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AQI India ETL — Air Quality Data Pipeline",
  description:
    "End-to-end ETL pipeline for India's air quality monitoring data. Interactive dashboard, profiling reports and full documentation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>

        {/* ── Ambient background ─────────────────────────────── */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[#030914]" />
          <div
            className="blob-anim absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 18% 25%, rgba(6,182,212,.09) 0%, transparent 58%)," +
                "radial-gradient(ellipse 60% 55% at 88% 72%, rgba(245,158,11,.07) 0%, transparent 52%)," +
                "radial-gradient(ellipse 55% 65% at 52% 105%, rgba(139,92,246,.07) 0%, transparent 55%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(6,182,212,.06) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <NavBar />

        <main className="flex-1">{children}</main>

        <footer className="mt-auto py-6 border-t border-cyan-500/10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              © 2025 · ETL Pipeline — Calidad del Aire en India
            </p>
            <p className="text-xs text-slate-600">
              Dataset:{" "}
              <a
                href="https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500/60 hover:text-cyan-400 transition-colors"
              >
                Air Quality Data in India — Kaggle
              </a>
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
