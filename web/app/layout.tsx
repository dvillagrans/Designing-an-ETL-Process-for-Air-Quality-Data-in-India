import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "India Air Quality — ETL Pipeline",
  description:
    "End-to-end ETL pipeline for India's air quality monitoring data. Interactive dashboard, profiling reports and full documentation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased flex min-h-screen flex-col page-bg">
        <Navigation />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
