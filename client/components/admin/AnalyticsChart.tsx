"use client";

import React, { useState } from "react";

export interface TimelinePoint {
  date: string;
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
  toolUses: number;
}

interface AnalyticsChartProps {
  data: TimelinePoint[];
  loading?: boolean;
}

type MetricKey = "visits" | "uniqueVisitors" | "pageViews" | "toolUses";

const METRIC_CONFIG: Record<
  MetricKey,
  { label: string; color: string; stroke: string; fill: string }
> = {
  visits: {
    label: "Total Visits",
    color: "text-violet-600",
    stroke: "#7c3aed",
    fill: "rgba(124, 58, 237, 0.08)",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "text-blue-600",
    stroke: "#2563eb",
    fill: "rgba(37, 99, 235, 0.08)",
  },
  pageViews: {
    label: "Page Views",
    color: "text-emerald-600",
    stroke: "#059669",
    fill: "rgba(5, 150, 105, 0.08)",
  },
  toolUses: {
    label: "Tool Usage",
    color: "text-amber-600",
    stroke: "#d97706",
    fill: "rgba(217, 119, 6, 0.08)",
  },
};

export default function AnalyticsChart({ data = [], loading = false }: AnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("visits");
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-80 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-100 rounded-md w-36 animate-pulse" />
          <div className="h-8 bg-slate-100 rounded-lg w-64 animate-pulse" />
        </div>
        <div className="h-52 bg-slate-50/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

  if (sortedData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center min-h-[320px]">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">No timeline data recorded yet</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Traffic trends will plot here in real-time as visitors explore your tools and content.
        </p>
      </div>
    );
  }

  // Calculate SVG Dimensions & Scales
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const values = sortedData.map((d) => d[activeMetric] || 0);
  const maxValue = Math.max(...values, 5);
  const numYAxisTicks = 4;
  const yTicks = Array.from({ length: numYAxisTicks + 1 }, (_, i) =>
    Math.round((maxValue / numYAxisTicks) * (numYAxisTicks - i))
  );

  const getX = (index: number) => {
    if (sortedData.length === 1) return width / 2;
    return paddingX + (index / (sortedData.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    const usableHeight = height - paddingY * 2;
    return height - paddingY - (val / maxValue) * usableHeight;
  };

  // Build SVG Path
  const points = sortedData.map((d, i) => `${getX(i)},${getY(d[activeMetric] || 0)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${getX(sortedData.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;

  const cfg = METRIC_CONFIG[activeMetric];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Chart Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Traffic Trend</div>
          <div className="text-base font-bold text-slate-900">
            {cfg.label} Over Time
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 self-start sm:self-auto">
          {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
            const item = METRIC_CONFIG[key];
            const isActive = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-slate-950 font-semibold shadow-xs"
                    : "hover:text-slate-950 text-slate-500"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64 overflow-visible"
        >
          {/* Horizontal Grid lines */}
          {yTicks.map((tick, idx) => {
            const yPos = getY(tick);
            return (
              <g key={idx} className="text-slate-300">
                <line
                  x1={paddingX}
                  y1={yPos}
                  x2={width - paddingX}
                  y2={yPos}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
                <text
                  x={paddingX - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          <path d={areaPath} fill={cfg.fill} />

          {/* Metric Line */}
          <path
            d={linePath}
            fill="none"
            stroke={cfg.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Dots */}
          {sortedData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d[activeMetric] || 0);
            const isHovered = hoveredPoint?.date === d.date;

            return (
              <g
                key={d.date}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint(d)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : sortedData.length > 25 ? 2.5 : 4}
                  fill="#ffffff"
                  stroke={cfg.stroke}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all"
                />
                {/* Touch target expander */}
                <circle cx={cx} cy={cy} r={16} fill="transparent" />
              </g>
            );
          })}

          {/* X Axis Date Labels (Sampled to avoid overlap) */}
          {sortedData.map((d, i) => {
            const shouldShow =
              sortedData.length <= 8 ||
              i === 0 ||
              i === sortedData.length - 1 ||
              i % Math.ceil(sortedData.length / 6) === 0;

            if (!shouldShow) return null;

            return (
              <text
                key={d.date}
                x={getX(i)}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {d.date.slice(5)}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-slate-800 pointer-events-none flex items-center gap-3 animate-in fade-in zoom-in-95">
            <span className="text-slate-400 font-mono">{hoveredPoint.date}</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.stroke }} />
              <span>
                {hoveredPoint[activeMetric]} {cfg.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
