import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryText?: string;
  secondaryHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  secondaryText,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100/60 text-violet-600 flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition-colors"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {actionText && onAction && !actionHref && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition-colors"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {secondaryText && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {secondaryText}
          </Link>
        )}
      </div>
    </div>
  );
}
