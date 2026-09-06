"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users2,
  Wrench,
  FileText,
  KeyRound,
  Settings,
  Code2,
  History,
  Activity,
  HelpCircle,
  Menu,
  X,
  RefreshCw,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Bot,
  Sparkles,
  Globe,
} from "lucide-react";
import KravionaLogo from "./KravionaLogo";
import { useAdmin } from "./AdminContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  showDateRange?: boolean;
}

export default function AdminLayout({
  children,
  pageTitle,
  showDateRange = true,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isLoading, days, setDays, refreshKey, triggerRefresh, logout, toasts, removeToast } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [systemHealthy, setSystemHealthy] = useState<boolean | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isLoading, token, pathname, router]);

  // Light health check for topbar status indicator
  useEffect(() => {
    let active = true;
    async function checkHealth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/health`);
        if (active) setSystemHealthy(res.ok);
      } catch {
        if (active) setSystemHealthy(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 45000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [refreshKey]);

  // Refresh animation handler
  const handleRefresh = () => {
    setRefreshing(true);
    triggerRefresh();
    setTimeout(() => setRefreshing(false), 700);
  };

  const navGroups = [
    {
      group: "Workspace",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3, exact: true },
        { label: "Visitors", href: "/admin/analytics/visitors", icon: Users2, exact: false },
        { label: "Tools", href: "/admin/tools", icon: Wrench, exact: false },
        { label: "Content", href: "/admin/content", icon: FileText, exact: false },
        { label: "SEO & Meta", href: "/admin/seo", icon: Globe, exact: false },
        { label: "Robots.txt", href: "/admin/settings/robots", icon: Bot, exact: false },
        { label: "LLMs.txt", href: "/admin/settings/llms", icon: Sparkles, exact: false },
        { label: "Custom Code", href: "/admin/settings/custom-code", icon: Code2, exact: false },
        { label: "API Management", href: "/admin/api", icon: KeyRound, exact: false },
        { label: "Settings", href: "/admin/settings", icon: Settings, exact: true },
      ],
    },
    {
      group: "System",
      items: [
        { label: "Activity Logs", href: "/admin/activity", icon: History, exact: false },
        { label: "System Status", href: "/admin/system", icon: Activity, exact: false },
        { label: "Help & Docs", href: "/admin/help", icon: HelpCircle, exact: false },
      ],
    },
  ];

  // If loading session or on login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verifying Session...</span>
        </div>
      </div>
    );
  }

  // Derive dynamic page title and breadcrumbs if not provided
  const cleanPath = pathname?.replace(/\/$/, "") || "/admin";
  const currentSegment = cleanPath.split("/").pop() || "Dashboard";
  const displayTitle =
    pageTitle ||
    currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1).replace("-", " ");

  const breadcrumbItems = cleanPath
    .split("/")
    .filter(Boolean)
    .map((seg, idx, arr) => {
      const href = "/" + arr.slice(0, idx + 1).join("/");
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace("-", " ");
      return { href, label, isLast: idx === arr.length - 1 };
    });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex antialiased selection:bg-violet-500 selection:text-white">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
              t.type === "success"
                ? "bg-white/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10"
                : t.type === "error"
                ? "bg-white/95 border-rose-200 text-rose-950 shadow-rose-500/10"
                : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
              {t.type === "info" && <ShieldCheck className="w-4 h-4 text-violet-600 flex-shrink-0" />}
              <span className="font-medium text-xs sm:text-sm">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
          <Link href="/admin">
            <KravionaLogo size="md" />
          </Link>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
            <span
              className={`w-2 h-2 rounded-full ${
                systemHealthy === true
                  ? "bg-emerald-500"
                  : systemHealthy === false
                  ? "bg-rose-500"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            {systemHealthy === true ? "Live" : systemHealthy === false ? "Offline" : "Checking"}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {grp.group}
              </div>
              <nav className="space-y-1">
                {grp.items.map((item) => {
                  const isActive = item.exact
                    ? cleanPath === item.href
                    : cleanPath.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-violet-50/80 text-violet-700 font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800 truncate">{user?.name || "Kraviona Admin"}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || "admin@kraviona.site"}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
              <KravionaLogo size="md" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {navGroups.map((grp) => (
                <div key={grp.group}>
                  <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {grp.group}
                  </div>
                  <nav className="space-y-1">
                    {grp.items.map((item) => {
                      const isActive = item.exact
                        ? cleanPath === item.href
                        : cleanPath.startsWith(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-violet-50 text-violet-700 font-semibold"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-violet-600" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800">{user?.name || "Admin"}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Hierarchy */}
            <div className="flex flex-col justify-center">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                {breadcrumbItems.map((bc) => (
                  <React.Fragment key={bc.href}>
                    {bc.isLast ? (
                      <span className="text-slate-700 font-medium">{bc.label}</span>
                    ) : (
                      <>
                        <Link href={bc.href} className="hover:text-violet-600 transition-colors">
                          {bc.label}
                        </Link>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {displayTitle}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date Range Selector */}
            {showDateRange && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                {[
                  { label: "Today", value: 1 },
                  { label: "7D", value: 7 },
                  { label: "30D", value: 30 },
                  { label: "90D", value: 90 },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setDays(range.value)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      days === range.value
                        ? "bg-white text-slate-900 font-semibold shadow-xs"
                        : "hover:text-slate-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              title="Refresh Data"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-violet-600" : ""}`} />
            </button>

            {/* Live Website Link */}
            <Link
              href="/"
              target="_blank"
              title="Visit Live Site"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 border border-slate-200 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 truncate">{user?.name || "Admin"}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Platform Settings
                    </Link>
                    <Link
                      href="/admin/system"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      System Health
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
