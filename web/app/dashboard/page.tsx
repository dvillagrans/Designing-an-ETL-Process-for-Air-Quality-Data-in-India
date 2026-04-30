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
  Good: "#4ade80",
  Satisfactory: "#a3e635",
  Moderate: "#facc15",
  Poor: "#fb923c",
  "Very Poor": "#f87171",
  Severe: "#c084fc",
};

const GRID_COLOR = "#1a1a16";
const TICK_COLOR = "#3d3c30";

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#4ade80";
  if (aqi <= 100) return "#a3e635";
  if (aqi <= 200) return "#facc15";
  if (aqi <= 300) return "#fb923c";
  if (aqi <= 400) return "#f87171";
  return "#c084fc";
}

function getAqiBucket(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

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
        background: "rgba(10, 11, 8, 0.97)",
        border: "1px solid rgba(122, 173, 74, 0.25)",
        borderRadius: 0,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        fontSize: 11,
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {label && (
        <p style={{ color: "#3d3c30", marginBottom: 6, letterSpacing: "0.05em" }}>
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            color: p.color || "#e8e4d4",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}
        >
          {p.name}: <span style={{ color: "#e8e4d4" }}>{p.value}</span>
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
    const avgAqi = aqis.length
      ? Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length)
      : 0;
    const good = filtered.filter((r) => r.AQI_Bucket === "Good").length;
    const poor = filtered.filter((r) =>
      ["Poor", "Very Poor", "Severe"].includes(r.AQI_Bucket)
    ).length;
    return { avgAqi, good, poor, total: filtered.length };
  }, [filtered]);

  const timeSeries = useMemo(() => {
    const byDate: Record<
      string,
      { date: string; avgAqi: number; count: number }
    > = {};
    filtered.forEach((r) => {
      if (!byDate[r.Date])
        byDate[r.Date] = { date: r.Date, avgAqi: 0, count: 0 };
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
    "border border-[rgba(232,228,212,0.07)] bg-[#0f1009] px-3 py-2 text-[#e8e4d4] text-[11px] font-mono tracking-widest focus:outline-none focus:border-[#7aad4a]/40 transition-colors cursor-pointer appearance-none";

  const goodPct = kpis.total
    ? Math.round((kpis.good / kpis.total) * 100)
    : 0;
  const poorPct = kpis.total
    ? Math.round((kpis.poor / kpis.total) * 100)
    : 0;
  const aqiBucket = getAqiBucket(kpis.avgAqi);
  const aqiColor = getAqiColor(kpis.avgAqi);
  const aqiGaugePct = Math.min(100, Math.round((kpis.avgAqi / 500) * 100));

  const cleanest = cityAvg[cityAvg.length - 1];
  const mostPolluted = cityAvg[0];

  const cardBase =
    "border border-[rgba(232,228,212,0.07)] bg-[#0f1009] p-5";
  const labelBase =
    "font-mono text-[10px] tracking-widest text-[#3d3c30] uppercase";

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-16">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-px h-10 bg-[#7aad4a]" />
            <div>
              <h1 className="font-mono text-lg font-bold text-[#e8e4d4] tracking-widest">
                DASHBOARD AQI
              </h1>
              <p className="font-mono text-[10px] text-[#3d3c30] mt-1 tracking-widest">
                INDIA · INDICE DE CALIDAD DEL AIRE · DATOS HISTORICOS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-[rgba(232,228,212,0.07)] bg-[#0f1009]">
            <span className="w-1 h-1 bg-[#7aad4a] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#7a7560]">
              {kpis.total.toLocaleString()} REGISTROS
            </span>
          </div>
        </div>

        {/* Filters */}
        <section className={`${cardBase}`}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>CIUDAD</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={inputClass}
              >
                <option value="all">TODAS</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>DESDE</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>HASTA</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              onClick={() => {
                setSelectedCity("all");
                setDateFrom("2019-01-01");
                setDateTo("2019-07-19");
              }}
              className="ml-auto px-3 py-2 font-mono text-[10px] tracking-widest text-[#3d3c30] hover:text-[#7a7560] border border-[rgba(232,228,212,0.07)] hover:border-[rgba(232,228,212,0.14)] transition-all"
            >
              RESETEAR
            </button>
          </div>
        </section>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {/* AQI Medio */}
          <div className={`${cardBase} flex flex-col gap-3`}>
            <div className="flex items-start justify-between">
              <p className={labelBase}>AQI MEDIO</p>
              <span
                className="font-mono text-[10px] font-bold px-2 py-0.5 tracking-widest"
                style={{
                  background: `${aqiColor}18`,
                  color: aqiColor,
                  border: `1px solid ${aqiColor}33`,
                }}
              >
                {aqiBucket.toUpperCase()}
              </span>
            </div>
            <p
              className="font-mono text-4xl font-bold leading-none tracking-wider"
              style={{ color: aqiColor }}
            >
              {kpis.avgAqi}
            </p>
            <div className="space-y-1">
              <div className="h-1 w-full bg-[#1a1a16] overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{ width: `${aqiGaugePct}%`, background: aqiColor }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#3d3c30] tracking-widest">
                <span>0</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
                <span>400</span>
                <span>500</span>
              </div>
            </div>
          </div>

          {/* Good days */}
          <div className={`${cardBase} flex flex-col gap-3`}>
            <div className="flex items-start justify-between">
              <p className={labelBase}>DIAS GOOD</p>
              <div className="w-6 h-6 border border-[#4ade8033] flex items-center justify-center text-[#4ade80]">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
            <p className="font-mono text-3xl font-bold text-[#4ade80] leading-none tracking-wider">
              {kpis.good}
            </p>
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[#3d3c30]">DEL TOTAL</span>
                <span className="text-[#4ade80] font-bold">{goodPct}%</span>
              </div>
              <div className="h-1 w-full bg-[#1a1a16] overflow-hidden">
                <div
                  className="h-full bg-[#4ade80] transition-all duration-700"
                  style={{ width: `${goodPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Poor+ */}
          <div className={`${cardBase} flex flex-col gap-3`}>
            <div className="flex items-start justify-between">
              <p className={labelBase}>POOR+</p>
              <div className="w-6 h-6 border border-[#f8717133] flex items-center justify-center text-[#f87171]">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
            <p className="font-mono text-3xl font-bold text-[#f87171] leading-none tracking-wider">
              {kpis.poor}
            </p>
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[#3d3c30]">DEL TOTAL</span>
                <span className="text-[#f87171] font-bold">{poorPct}%</span>
              </div>
              <div className="h-1 w-full bg-[#1a1a16] overflow-hidden">
                <div
                  className="h-full bg-[#f87171] transition-all duration-700"
                  style={{ width: `${poorPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total + highlights */}
          <div className={`${cardBase} flex flex-col gap-3`}>
            <p className={labelBase}>REGISTROS</p>
            <p className="font-mono text-3xl font-bold text-[#e8e4d4] leading-none tracking-wider">
              {kpis.total.toLocaleString()}
            </p>
            <div className="space-y-2 mt-auto">
              {cleanest && (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#3d3c30] flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-[#4ade80]" />
                    MAS LIMPIA
                  </span>
                  <span className="text-[#e8e4d4] font-medium">
                    {cleanest.city.toUpperCase()}
                  </span>
                </div>
              )}
              {mostPolluted && (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#3d3c30] flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-[#f87171]" />
                    MAS CONTAMINADA
                  </span>
                  <span className="text-[#e8e4d4] font-medium">
                    {mostPolluted.city.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Area chart + Donut */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Area chart */}
          <div className={`lg:col-span-3 ${cardBase} flex flex-col gap-4`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-mono text-xs font-bold text-[#e8e4d4] tracking-widest">
                  EVOLUCION AQI DIARIA
                </h2>
                <p className="font-mono text-[10px] text-[#3d3c30] mt-1 tracking-widest">
                  MEDIA POR DIA · UMBRALES DE REFERENCIA
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#3d3c30] tracking-widest">
                <span className="w-3 h-px bg-[#7aad4a] inline-block" />
                AQI MEDIO
              </div>
            </div>
            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeries}
                    margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="aqi-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#7aad4a"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="#7aad4a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={GRID_COLOR}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: TICK_COLOR, fontFamily: "'Space Mono', monospace" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: TICK_COLOR, fontFamily: "'Space Mono', monospace" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine
                      y={100}
                      stroke="#facc15"
                      strokeDasharray="4 3"
                      strokeOpacity={0.4}
                      label={{
                        value: "MODERADO",
                        fill: "#facc15",
                        fontSize: 9,
                        position: "insideTopRight",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    />
                    <ReferenceLine
                      y={200}
                      stroke="#fb923c"
                      strokeDasharray="4 3"
                      strokeOpacity={0.4}
                      label={{
                        value: "MALO",
                        fill: "#fb923c",
                        fontSize: 9,
                        position: "insideTopRight",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgAqi"
                      stroke="#7aad4a"
                      strokeWidth={1.5}
                      fill="url(#aqi-fill)"
                      name="AQI medio"
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#7aad4a",
                        stroke: "#0a0b08",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>

          {/* Donut chart */}
          <div className={`lg:col-span-2 ${cardBase} flex flex-col gap-4`}>
            <div>
              <h2 className="font-mono text-xs font-bold text-[#e8e4d4] tracking-widest">
                DISTRIBUCION AQI BUCKET
              </h2>
              <p className="font-mono text-[10px] text-[#3d3c30] mt-1 tracking-widest">
                PROPORCION DE DIAS POR CATEGORIA
              </p>
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
                          <Cell
                            key={i}
                            fill={
                              AQI_COLORS[bucketCounts[i].name] || "#3d3c30"
                            }
                          />
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
                  const pct = kpis.total
                    ? Math.round((value / kpis.total) * 100)
                    : 0;
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider"
                    >
                      <span
                        className="w-2 h-2 flex-shrink-0"
                        style={{
                          background: AQI_COLORS[name] || "#3d3c30",
                        }}
                      />
                      <span className="text-[#3d3c30] truncate">
                        {name.toUpperCase()}
                      </span>
                      <span className="text-[#7a7560] font-bold ml-auto">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Ranking + Bar chart */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Bar chart */}
          <div className={`lg:col-span-3 ${cardBase} flex flex-col gap-4`}>
            <div>
              <h2 className="font-mono text-xs font-bold text-[#e8e4d4] tracking-widest">
                AQI MEDIO POR CIUDAD
              </h2>
              <p className="font-mono text-[10px] text-[#3d3c30] mt-1 tracking-widest">
                CADA BARRA COLOREADA POR NIVEL DE CALIDAD
              </p>
            </div>
            <div className="h-72 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cityAvg}
                    layout="vertical"
                    margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={GRID_COLOR}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 10,
                        fill: TICK_COLOR,
                        fontFamily: "'Space Mono', monospace",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="city"
                      width={90}
                      tick={{
                        fontSize: 10,
                        fill: "#7a7560",
                        fontFamily: "'Space Mono', monospace",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="avgAqi"
                      name="AQI medio"
                      radius={[0, 0, 0, 0]}
                      maxBarSize={16}
                    >
                      {cityAvg.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={getAqiColor(entry.avgAqi)}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>

          {/* City ranking table */}
          <div className={`lg:col-span-2 ${cardBase} flex flex-col gap-4`}>
            <div>
              <h2 className="font-mono text-xs font-bold text-[#e8e4d4] tracking-widest">
                RANKING
              </h2>
              <p className="font-mono text-[10px] text-[#3d3c30] mt-1 tracking-widest">
                CIUDADES ORDENADAS POR AQI
              </p>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-72 pr-1 scrollbar-thin">
              {cityAvg.map((entry, i) => {
                const barWidth = Math.min(
                  100,
                  Math.round((entry.avgAqi / 400) * 100)
                );
                const color = getAqiColor(entry.avgAqi);
                return (
                  <div
                    key={entry.city}
                    className="flex items-center gap-3 py-2 border-b border-[rgba(232,228,212,0.05)] last:border-0"
                  >
                    <span className="font-mono text-[10px] text-[#3d3c30] w-4 text-right shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[11px] text-[#e8e4d4] font-medium truncate tracking-wider">
                          {entry.city.toUpperCase()}
                        </span>
                        <span
                          className="font-mono text-[11px] font-bold shrink-0 ml-2"
                          style={{ color }}
                        >
                          {entry.avgAqi}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-[#1a1a16] overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${barWidth}%`, background: color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AQI Scale legend */}
        <section className={`${cardBase} p-4`}>
          <p className={`${labelBase} mb-3`}>ESCALA DE REFERENCIA AQI</p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="aqi-bar h-2 flex-1 min-w-48" />
            <div className="flex flex-wrap gap-3">
              {Object.entries(AQI_COLORS).map(([label, color]) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-[#7a7560] tracking-wider"
                >
                  <span
                    className="w-2.5 h-2.5"
                    style={{ background: color }}
                  />
                  {label.toUpperCase()}
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
      <div className="flex gap-2 items-center text-[#3d3c30] font-mono text-[11px] tracking-widest">
        <svg
          className="w-4 h-4 animate-spin text-[#7aad4a]/30"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        CARGANDO DATOS...
      </div>
    </div>
  );
}
