"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Wrench,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";

interface VisitorEvent {
  _id: string;
  type: string;
  path: string;
  title: string;
  country: string;
  deviceType: string;
  browser: string;
  referrer: string;
  ip: string;
  createdAt: string;
}

export default function VisitorDetailsPage() {
  const { token, days, refreshKey, apiBase } = useAdmin();
  const [visitors, setVisitors] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [showRawIp, setShowRawIp] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadVisitors() {
      if (!token) return;
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          days: String(days),
          page: String(page),
          limit: "25",
          search: search.trim(),
          rawIp: String(showRawIp),
        });

        const res = await fetch(`${apiBase}/api/analytics/visitors?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          if (active) {
            setVisitors(json.visitors || []);
            setTotalPages(json.pagination?.pages || 1);
            setTotalCount(json.pagination?.total || 0);
          }
        }
      } catch (err) {
        console.error("Error loading visitors:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadVisitors();
    return () => {
      active = false;
    };
  }, [token, days, page, search, showRawIp, refreshKey, apiBase]);

  return (
    <AdminLayout pageTitle="Visitor Details" showDateRange={true}>
      <div className="space-y-6">
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 mb-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Analytics</span>
            </Link>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Visitor Activity Logs</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Detailed event streams and session origins for audit inspection.
            </p>
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={() => setShowRawIp(!showRawIp)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showRawIp
                ? "bg-amber-50 text-amber-900 border-amber-300"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {showRawIp ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-600" />
                <span>Raw IP Inspection: ON</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>IP Masking: ACTIVE (Recommended)</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy Disclosure Notice */}
        <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-start gap-3.5 text-xs text-violet-950">
          <ShieldAlert className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold">Privacy-First Architecture Notice</span>
            <p className="text-violet-900/80 leading-relaxed">
              Kraviona values visitor privacy. Public telemetry anonymizes IP addresses using irreversible SHA-256 HMAC tokens. Raw IP addresses are strictly restricted to authenticated administrators and must not be shared or exported without compliance with GDPR, CCPA, and applicable local privacy regulations.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by path, referrer, browser..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono self-end sm:self-auto">
            Showing {visitors.length} of {totalCount.toLocaleString()} events
          </div>
        </div>

        {/* Visitor Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Page / Target</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Browser</th>
                  <th className="py-3 px-4">Referrer</th>
                  <th className="py-3 px-4">Visitor IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="p-4">
                        <div className="h-6 bg-slate-100 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : visitors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No visitor records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  visitors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            v.type === "tool_use"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                              : "bg-violet-50 text-violet-700 border border-violet-200/50"
                          }`}
                        >
                          {v.type === "tool_use" ? (
                            <Wrench className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          <span>{v.type === "tool_use" ? "Tool" : "Page"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800 max-w-[200px] truncate">
                        {v.path}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {v.country}
                      </td>
                      <td className="py-3 px-4 text-slate-600 capitalize">
                        {v.deviceType}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {v.browser}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-[150px] truncate">
                        {v.referrer}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {showRawIp ? (
                          <span className="text-amber-700 font-semibold">{v.ip}</span>
                        ) : (
                          <span className="text-slate-400">{v.ip}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
