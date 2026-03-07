"use client";

import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";

type CityDayRow = {
  City: string;
  Date: string;
  PM2_5?: number;
  "PM2.5"?: number;
  PM10: number;
  AQI: number;
  AQI_Bucket: string;
};

const AQI_COLORS: Record<string, string> = {
  Good: "#22c55e",
  Satisfactory: "#84cc16",
  Moderate: "#eab308",
  Poor: "#f97316",
  "Very Poor": "#ef4444",
  Severe: "#7c3aed",
};

const GRID_COLOR = "#1a2540";
const TICK_COLOR = "#475569";

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#84cc16";
  if (aqi <= 200) return "#eab308";
  if (aqi <= 300) return "#f97316";
  if (aqi <= 400) return "#ef4444";
  return "#7c3aed";
}

function getAqiBucket(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

// ── Custom Tooltip ─────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(5,17,40,.95)",
        border: "1px solid rgba(6,182,212,.22)",
        borderRadius: 14,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        fontSize: 12,
      }}
    >
      {label && <p style={{ color: "#64748b", marginBottom: 6 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#e2e8f0", fontWeight: 600 }}>
          {p.name}: <span style={{ color: "#e2e8f0" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [rawData, setRawData] = useState<CityDayRow[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("2019-01-01");
  const [dateTo, setDateTo] = useState<string>("2019-07-19");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/data/city_day_sample.json")
      .then((r) => r.json())
      .then((d: CityDayRow[]) => setRawData(d));
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((c: string[]) => setCities(c));
  }, []);

  const filtered = useMemo(() => {
    return rawData.filter((r) => {
      const cityOk = selectedCity === "all" || r.City === selectedCity;
      const dateOk = r.Date >= dateFrom && r.Date <= dateTo;
      return cityOk && dateOk;
    });
  }, [rawData, selectedCity, dateFrom, dateTo]);

  const kpis = useMemo(() => {
    if (!filtered.length) return { avgAqi: 0, good: 0, poor: 0, total: 0 };
    const aqis = filtered.map((r) => r.AQI).filter((n) => n != null);
    const avgAqi = aqis.length ? Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length) : 0;
    const good = filtered.filter((r) => r.AQI_Bucket === "Good").length;
    const poor = filtered.filter((r) => ["Poor", "Very Poor", "Severe"].includes(r.AQI_Bucket)).length;
    return { avgAqi, good, poor, total: filtered.length };
  }, [filtered]);

  const timeSeries = useMemo(() => {
    const byDate: Record<string, { date: string; avgAqi: number; count: number }> = {};
    filtered.forEach((r) => {
      if (!byDate[r.Date]) byDate[r.Date] = { date: r.Date, avgAqi: 0, count: 0 };
      byDate[r.Date].avgAqi += r.AQI;
      byDate[r.Date].count += 1;
    });
    return Object.values(byDate)
      .map((v) => ({ ...v, avgAqi: Math.round(v.avgAqi / v.count) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  const bucketCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((r) => {
      const b = r.AQI_Bucket || "Unknown";
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const cityAvg = useMemo(() => {
    const byCity: Record<string, { sum: number; n: number }> = {};
    filtered.forEach((r) => {
      if (!byCity[r.City]) byCity[r.City] = { sum: 0, n: 0 };
      byCity[r.City].sum += r.AQI;
      byCity[r.City].n += 1;
    });
    return Object.entries(byCity)
      .map(([city, v]) => ({ city, avgAqi: Math.round(v.sum / v.n) }))
      .sort((a, b) => b.avgAqi - a.avgAqi);
  }, [filtered]);

  const inputClass =
    "rounded-xl border border-white/8 bg-slate-900/70 px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer";

  const goodPct = kpis.total ? Math.round((kpis.good / kpis.total) * 100) : 0;
  const poorPct = kpis.total ? Math.round((kpis.poor / kpis.total) * 100) : 0;
  const aqiBucket = getAqiBucket(kpis.avgAqi);
  const aqiColor = getAqiColor(kpis.avgAqi);

  // AQI gauge: map 0-500 to 0-100%
  const aqiGaugePct = Math.min(100, Math.round((kpis.avgAqi / 500) * 100));

  const cleanest = cityAvg[cityAvg.length - 1];
  const mostPolluted = cityAvg[0];

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-16">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Dashboard AQI</h1>
              <p className="text-xs text-slate-500 mt-0.5">India · Índice de Calidad del Aire · Datos históricos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {kpis.total.toLocaleString()} registros activos
          </div>
        </div>

        {/* ── Filters ───────────────────────────────────────────── */}
        <section className="glass rounded-2xl px-5 py-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Ciudad</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className={inputClass}>
                <option value="all">Todas las ciudades</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Desde</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Hasta</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
            </div>
            <button
              onClick={() => { setSelectedCity("all"); setDateFrom("2019-01-01"); setDateTo("2019-07-19"); }}
              className="ml-auto px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 border border-white/8 hover:border-white/15 transition-all"
            >
              Resetear
            </button>
          </div>
        </section>

        {/* ── KPI Strip ─────────────────────────────────────────── */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          {/* AQI Medio — hero card with gauge */}
          <div className="col-span-2 xl:col-span-1 glass rounded-2xl p-5 border border-cyan-500/15 kpi-glow-cyan flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">AQI Medio</p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${aqiColor}22`, color: aqiColor, border: `1px solid ${aqiColor}44` }}
              >
                {aqiBucket}
              </span>
            </div>
            <p className="text-4xl font-black grad-text leading-none">{kpis.avgAqi}</p>
            {/* AQI gauge bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${aqiGaugePct}%`, background: aqiColor }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-600">
                <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
              </div>
            </div>
          </div>

          {/* Good days */}
          <div className="glass rounded-2xl p-5 border border-green-500/15 kpi-glow-green flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Días Good</p>
              <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-black text-green-400 leading-none">{kpis.good}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600">del total</span>
                <span className="text-green-400 font-semibold">{goodPct}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-400 transition-all duration-700" style={{ width: `${goodPct}%` }} />
              </div>
            </div>
          </div>

          {/* Poor / Severe */}
          <div className="glass rounded-2xl p-5 border border-red-500/15 kpi-glow-red flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">Poor+</p>
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-black text-red-400 leading-none">{kpis.poor}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600">del total</span>
                <span className="text-red-400 font-semibold">{poorPct}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-400 transition-all duration-700" style={{ width: `${poorPct}%` }} />
              </div>
            </div>
          </div>

          {/* Total + city highlights */}
          <div className="glass rounded-2xl p-5 border border-slate-700/30 flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Registros</p>
            <p className="text-3xl font-black text-slate-200 leading-none">{kpis.total.toLocaleString()}</p>
            <div className="space-y-2 mt-auto">
              {cleanest && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Más limpia
                  </span>
                  <span className="text-slate-300 font-medium">{cleanest.city}</span>
                </div>
              )}
              {mostPolluted && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />Más contaminada
                  </span>
                  <span className="text-slate-300 font-medium">{mostPolluted.city}</span>
                </div>
              )}
            </div>
          </div>

        </section>

        {/* ── Area chart + Donut ────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Area chart — 3 cols */}
          <div className="lg:col-span-3 glass rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-200">Evolución AQI diaria</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Media por día · con umbrales de referencia</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="w-2 h-px bg-cyan-400 inline-block" />AQI medio
              </div>
            </div>
            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="aqi-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: TICK_COLOR }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: TICK_COLOR }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={100} stroke="#eab308" strokeDasharray="4 3" strokeOpacity={0.4}
                      label={{ value: "Moderado", fill: "#eab308", fontSize: 9, position: "insideTopRight" }} />
                    <ReferenceLine y={200} stroke="#f97316" strokeDasharray="4 3" strokeOpacity={0.4}
                      label={{ value: "Malo", fill: "#f97316", fontSize: 9, position: "insideTopRight" }} />
                    <Area
                      type="monotone"
                      dataKey="avgAqi"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#aqi-fill)"
                      name="AQI medio"
                      dot={false}
                      activeDot={{ r: 5, fill: "#06b6d4", stroke: "#0f172a", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>

          {/* Donut chart — 2 cols */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Distribución AQI Bucket</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Proporción de días por categoría</p>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="h-44">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bucketCounts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={72}
                        innerRadius={44}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {bucketCounts.map((_, i) => (
                          <Cell key={i} fill={AQI_COLORS[bucketCounts[i].name] || "#475569"} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton />
                )}
              </div>
              {/* Custom legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {bucketCounts.map(({ name, value }) => {
                  const pct = kpis.total ? Math.round((value / kpis.total) * 100) : 0;
                  return (
                    <div key={name} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: AQI_COLORS[name] || "#475569" }} />
                      <span className="text-slate-500 truncate">{name}</span>
                      <span className="text-slate-400 font-semibold ml-auto">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Ranking + Bar chart ───────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Color-coded horizontal bar — 3 cols */}
          <div className="lg:col-span-3 glass rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200">AQI medio por ciudad</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Cada barra coloreada por nivel de calidad</p>
            </div>
            <div className="h-72 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityAvg} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: TICK_COLOR }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="city" width={90} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="avgAqi" name="AQI medio" radius={[0, 6, 6, 0]} maxBarSize={18}>
                      {cityAvg.map((entry, i) => (
                        <Cell key={i} fill={getAqiColor(entry.avgAqi)} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>

          {/* City ranking table — 2 cols */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Ranking</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Ciudades ordenadas por AQI</p>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-72 pr-1 scrollbar-thin">
              {cityAvg.map((entry, i) => {
                const barWidth = Math.min(100, Math.round((entry.avgAqi / 400) * 100));
                const color = getAqiColor(entry.avgAqi);
                return (
                  <div key={entry.city} className="flex items-center gap-3 py-2 border-b border-slate-800/60 last:border-0">
                    <span className="text-[11px] text-slate-600 w-4 text-right shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-300 font-medium truncate">{entry.city}</span>
                        <span className="text-xs font-bold shrink-0 ml-2" style={{ color }}>{entry.avgAqi}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, background: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── AQI Scale legend ───────────────────────────────────── */}
        <section className="glass rounded-2xl p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-3">Escala de referencia AQI</p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="aqi-bar h-2 flex-1 min-w-48 rounded-full" />
            <div className="flex flex-wrap gap-3">
              {Object.entries(AQI_COLORS).map(([label, color]) => (
                <span key={label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex gap-2 items-center text-slate-700 text-xs">
        <svg className="w-4 h-4 animate-spin text-cyan-800" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Cargando datos…
      </div>
    </div>
  );
}
