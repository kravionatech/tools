"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  Activity,
  Wrench,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import MetricCard from "@/components/admin/MetricCard";
import AnalyticsChart, { TimelinePoint } from "@/components/admin/AnalyticsChart";
import EmptyState from "@/components/admin/EmptyState";
import { useAdmin } from "@/components/admin/AdminContext";

interface DashboardSummary {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  toolUses: number;
  trends: {
    visitsChange: number;
    visitorsChange: number;
    pageViewsChange: number;
    toolUsesChange: number;
  };
  timeline: TimelinePoint[];
  topPages: Array<{ _id: string; views: number; uniqueVisitors: number; percentage: number }>;
  topTools: Array<{ _id: string; uses: number; uniqueUsers: number; percentage: number }>;
  recentEvents: Array<{ _id: string; type: string; path: string; title: string; createdAt: string; toolSlug?: string }>;
}

export default function AdminDashboardPage() {
  const { token, days, refreshKey, apiBase, user } = useAdmin();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/analytics/summary?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setData(json);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [token, days, refreshKey, apiBase]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const adminName = user?.name || "Admin";

  const hasData = (data?.totalVisits || 0) > 0;
  const mostUsedTool = data?.topTools?.[0]?._id || "None yet";

  return (
    <AdminLayout pageTitle="Dashboard" showDateRange={true}>
      <div className="space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-violet-950/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-violet-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-violet-200 text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span>Kraviona SaaS Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {greeting}, {adminName}
            </h2>
            <p className="text-xs sm:text-sm text-violet-200/80 mt-1 max-w-xl">
              Here’s what’s happening with Kraviona today. Traffic and tool operations across your platform.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 self-start sm:self-auto">
            <Link
              href="/admin/analytics"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-violet-950 hover:bg-violet-50 shadow-sm transition-all"
            >
              Full Analytics
            </Link>
            <Link
              href="/admin/tools"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
            >
              Manage Tools
            </Link>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <MetricCard
            title="Total Visits"
            value={data?.totalVisits ?? 0}
            change={data?.trends.visitsChange}
            periodLabel={`vs previous ${days}d`}
            icon={Activity}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            loading={loading}
            emptyHint="No visits recorded in this period"
          />

          <MetricCard
            title="Unique Visitors"
            value={data?.uniqueVisitors ?? 0}
            change={data?.trends.visitorsChange}
            periodLabel={`vs previous ${days}d`}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            loading={loading}
            emptyHint="No unique visitors yet"
          />

          <MetricCard
            title="Page Views"
            value={data?.pageViews ?? 0}
            change={data?.trends.pageViewsChange}
            periodLabel={`vs previous ${days}d`}
            icon={Eye}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            loading={loading}
            emptyHint="No page views recorded"
          />

          <MetricCard
            title="Tool Usage"
            value={data?.toolUses ?? 0}
            change={data?.trends.toolUsesChange}
            periodLabel={`vs previous ${days}d`}
            subtitle={`Top: ${mostUsedTool}`}
            icon={Wrench}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            loading={loading}
            emptyHint="No tools used in this window"
          />
        </div>

        {/* Empty State Banner if completely 0 */}
        {!loading && !hasData && (
          <EmptyState
            icon={Activity}
            title="No analytics data recorded yet"
            description="Your website has not received any tracked visits in this selected period. Verify client-side tracking is active and visit your tools to record live visits."
            actionText="Visit Live Site"
            actionHref="/"
            secondaryText="Setup Documentation"
            secondaryHref="/admin/help"
          />
        )}

        {/* Timeline Chart */}
        <AnalyticsChart data={data?.timeline || []} loading={loading} />

        {/* Snapshot Tables: Top Pages & Top Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Visited Pages</h3>
                <p className="text-xs text-slate-400">Pages with highest traffic this period</p>
              </div>
              <Link
                href="/admin/analytics"
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (data?.topPages || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No page visits recorded in this period.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Path</th>
                      <th className="pb-3 text-right">Views</th>
                      <th className="pb-3 text-right">Visitors</th>
                      <th className="pb-3 text-right">% Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.topPages.slice(0, 5).map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 font-mono font-medium text-slate-800 max-w-[180px] truncate">
                          {p._id}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-900 font-semibold">
                          {p.views.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-600">
                          {p.uniqueVisitors.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-violet-50 text-violet-700">
                            {p.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Tools Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Performing Tools</h3>
                <p className="text-xs text-slate-400">Most actively executed utilities</p>
              </div>
              <Link
                href="/admin/tools"
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <span>Tool Catalog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (data?.topTools || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tool executions tracked yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Tool</th>
                      <th className="pb-3 text-right">Uses</th>
                      <th className="pb-3 text-right">Users</th>
                      <th className="pb-3 text-right">% Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.topTools.slice(0, 5).map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 font-medium text-slate-800 capitalize truncate max-w-[160px]">
                          {t._id.replace(/-/g, " ")}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-900 font-semibold">
                          {t.uses.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-600">
                          {t.uniqueUsers.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700">
                            {t.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Stream & System Health Quick Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events (2 Cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
                <p className="text-xs text-slate-400">Recent visits and tool interactions</p>
              </div>
              <Link
                href="/admin/analytics/visitors"
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <span>Full Log</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (data?.recentEvents || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity logged.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data?.recentEvents.slice(0, 6).map((ev) => (
                  <div key={ev._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          ev.type === "tool_use"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-violet-50 text-violet-600"
                        }`}
                      >
                        {ev.type === "tool_use" ? (
                          <Wrench className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate">
                          {ev.title || ev.path}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">{ev.path}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 text-[11px] text-slate-400">
                      {new Date(ev.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Health Overview */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Workspace Shortcuts
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs font-medium">
                <Link
                  href="/admin/seo"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <span className="text-slate-700">SEO & Metadata</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/admin/api"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <span className="text-slate-700">API Management</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <span className="text-slate-700">Site Settings</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/admin/system"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <span className="text-slate-700">Diagnostics & Status</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Security Status
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                JWT Auth & Privacy IP Hashing active. Zero personal identity data exposed.
              </p>
              <Link
                href="/admin/activity"
                className="text-xs font-semibold text-violet-300 hover:text-white flex items-center gap-1"
              >
                <span>Review Audit Logs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
