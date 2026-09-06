"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";

interface ActivityLog {
  _id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  status: "success" | "warning" | "error";
  ip?: string;
  createdAt: string;
}

export default function ActivityLogsPage() {
  const { token, refreshKey, apiBase } = useAdmin();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string>("all");

  useEffect(() => {
    let active = true;
    async function loadLogs() {
      if (!token) return;
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "25",
        });
        if (selectedAction !== "all") query.append("action", selectedAction);

        const res = await fetch(`${apiBase}/api/activity?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          if (active) {
            setLogs(json.logs || []);
            setTotalPages(json.pagination?.pages || 1);
            setTotalCount(json.pagination?.total || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load activity logs:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLogs();
    return () => {
      active = false;
    };
  }, [token, page, selectedAction, refreshKey, apiBase]);

  const actionLabels: Record<string, string> = {
    all: "All Actions",
    admin_login: "Admin Login",
    login_failed: "Failed Login",
    settings_updated: "Settings Updated",
    tool_updated: "Tool Updated",
    api_config_created: "API Created",
    api_config_updated: "API Updated",
    api_config_deleted: "API Deleted",
    content_updated: "Content Updated",
  };

  const getStatusBadge = (status: string) => {
    if (status === "success") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Success</span>
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>Warning</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/50">
        <XCircle className="w-3 h-3 text-rose-600" />
        <span>Failed</span>
      </span>
    );
  };

  return (
    <AdminLayout pageTitle="Activity Logs" showDateRange={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Administrative Audit Trail</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chronological security log of configuration modifications, status toggles, and administrative sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase">Filter:</span>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="text-xs font-medium px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-xs"
            >
              {Object.entries(actionLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Account</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Component</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="p-4">
                        <div className="h-6 bg-slate-100 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No administrative activity recorded matching this filter.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{log.adminName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{log.adminEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200/50">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-[160px] truncate">
                        {log.target || "Platform"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-[240px] truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Page {page} of {totalPages} ({totalCount} total events)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
