import React from "react";
import Link from "next/link";
import { brandConfig } from "@/config/brand.config";

export interface KravionaLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  collapsed?: boolean;
  withBadge?: boolean;
  badgeText?: string;
  inverted?: boolean;
  href?: string;
  asLink?: boolean;
}

export default function KravionaLogo({
  className = "",
  size = "md",
  collapsed = false,
  withBadge = false,
  badgeText = "Admin",
  inverted = false,
  href,
  asLink = false,
}: KravionaLogoProps) {
  const iconSizes = {
    xs: "w-6 h-6",
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const svgGlyphSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const textSizes = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const content = (
    <div className={`flex items-center gap-2.5 select-none transition-transform active:scale-[0.98] ${className}`}>
      {/* Precision Geometric Squircle Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl shadow-sm overflow-hidden flex-shrink-0`}
        style={{ background: brandConfig.gradient }}
        title={`${brandConfig.name} logo`}
      >
        {/* Subtle grid reflection */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />

        {/* Scalable Vector K Glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${svgGlyphSizes[size]} text-white relative z-10`}
          aria-hidden="true"
        >
          <path d="M6 4v16" />
          <path d="M17 5L8 12.5" />
          <path d="M9.5 11.2L18 20" />
        </svg>
      </div>

      {/* Brand Wordmark & Badge */}
      {!collapsed && (
        <div className="flex items-center gap-2 leading-none">
          <span
            className={`font-extrabold tracking-tight ${textSizes[size]} ${
              inverted ? "text-white" : "text-slate-900"
            }`}
          >
            {brandConfig.name}
            <span className="text-violet-600">.</span>
            {!withBadge && (
              <span className="text-slate-400 font-semibold text-xs ml-1.5 uppercase tracking-wider">
                Tools
              </span>
            )}
          </span>

          {withBadge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-violet-100 text-violet-700 border border-violet-200/60">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink && href) {
    return (
      <Link href={href} className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
