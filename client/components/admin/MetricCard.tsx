import React from "react";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number; // percentage change vs previous period
  periodLabel?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string;
  loading?: boolean;
  emptyHint?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  periodLabel = "vs prev period",
  icon: Icon,
  iconBg = "bg-violet-50",
  iconColor = "text-violet-600",
  subtitle,
  loading = false,
  emptyHint,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between h-36">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
          <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <div>
          <div className="h-7 bg-slate-100 rounded w-20 mb-2 animate-pulse" />
          <div className="h-3 bg-slate-100 rounded w-32 animate-pulse" />
        </div>
      </div>
    );
  }

  const isZero = typeof value === "number" ? value === 0 : value === "0";
  const hasChange = typeof change === "number";
  const isPositive = hasChange && change > 0;
  const isNegative = hasChange && change < 0;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300/80 transition-all duration-200">
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
        </div>

        {/* Change / Status Indicator */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {isZero ? (
            <span className="text-slate-400 font-medium">
              {emptyHint || "No recorded activity yet"}
            </span>
          ) : hasChange ? (
            <>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold text-[11px] ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : isNegative
                    ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : isNegative ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                {isPositive ? `+${change}%` : `${change}%`}
              </span>
              <span className="text-slate-400 text-[11px] truncate">{periodLabel}</span>
            </>
          ) : (
            <span className="text-slate-400 text-[11px] truncate">{subtitle || periodLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}
