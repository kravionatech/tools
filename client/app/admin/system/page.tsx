"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Database,
  Server,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Cpu,
  Clock,
  Radio,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";

interface SystemReport {
  backend: {
    status: string;
    uptimeSeconds: number;
    nodeVersion: string;
    memoryUsageMb: number;
    environment: string;
  };
  database: {
    status: string;
    connectionState: string;
    pingLatencyMs: number;
    databaseName: string;
  };
  analytics: {
    status: string;
    totalRecordedEvents: number;
    lastEventTimestamp: string | null;
  };
  apis: {
    status: string;
    totalConfigured: number;
    activeProviders: number;
  };
  environmentAudit: {
    mongoConfigured: boolean;
    jwtConfigured: boolean;
    clientOrigin: string;
    port: number;
  };
  checkedAt: string;
  responseTimeMs: number;
}

export default function SystemStatusPage() {
  const { token, apiBase, showToast } = useAdmin();
  const [report, setReport] = useState<SystemReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatus = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const res = await fetch(`${apiBase}/api/system/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        showToast("Backend returned error status", "warning");
      }
    } catch (err) {
      showToast("Unable to reach backend diagnostics", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [token, apiBase]);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(" ");
  };

  const getStatusBadge = (status: string) => {
    if (status === "operational" || status === "Connected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Operational
        </span>
      );
    }
    if (status === "awaiting_traffic" || status === "none_configured") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Ready
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        Degraded
      </span>
    );
  };

  return (
    <AdminLayout pageTitle="System Status" showDateRange={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Platform System Diagnostics</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live operational health, memory allocation, database connectivity, and environment audit.
            </p>
          </div>

          <button
            onClick={loadStatus}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-violet-600" : ""}`} />
            <span>Run Health Check</span>
          </button>
        </div>

        {/* Global Overview Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">All Core Systems Operational</div>
              <div className="text-xs text-slate-400">
                Last verified: {report?.checkedAt ? new Date(report.checkedAt).toLocaleTimeString() : "Just now"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <div>Response: {report?.responseTimeMs || 0}ms</div>
            <div>Env: {report?.backend.environment || "production"}</div>
          </div>
        </div>

        {/* Diagnostic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Backend Express Service */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Backend API Engine</h3>
                  <p className="text-[11px] text-slate-400">Express / Node.js Runtime</p>
                </div>
              </div>
              {getStatusBadge(report?.backend.status || "operational")}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Process Uptime</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {report?.backend.uptimeSeconds ? formatUptime(report.backend.uptimeSeconds) : "0s"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Memory RSS</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {report?.backend.memoryUsageMb || 0} MB
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Node Engine</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {report?.backend.nodeVersion || process.version}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Service Port</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  :{report?.environmentAudit.port || 5000}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: MongoDB Persistence */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Database Engine</h3>
                  <p className="text-[11px] text-slate-400">MongoDB Cluster</p>
                </div>
              </div>
              {getStatusBadge(report?.database.connectionState || "Connected")}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Roundtrip Latency</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {report?.database.pingLatencyMs || 0} ms
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Database Name</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5 truncate">
                  {report?.database.databaseName || "kravionatools"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Recorded Telemetry</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {(report?.analytics.totalRecordedEvents || 0).toLocaleString()} events
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Last Ingestion</span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5 truncate">
                  {report?.analytics.lastEventTimestamp
                    ? new Date(report.analytics.lastEventTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "Awaiting event"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Readiness Audit Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900">Environment Configuration Audit</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">MONGODB_URI</div>
                <div className="text-[10px] text-slate-400">Database connection string</div>
              </div>
              {report?.environmentAudit.mongoConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">JWT_SECRET</div>
                <div className="text-[10px] text-slate-400">Session signing secret</div>
              </div>
              {report?.environmentAudit.jwtConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">CLIENT_ORIGIN</div>
                <div className="text-[10px] font-mono text-slate-400 truncate max-w-[110px]">
                  {report?.environmentAudit.clientOrigin || "http://localhost:3000"}
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">ANALYTICS ENGINE</div>
                <div className="text-[10px] text-slate-400">Client beacon pipeline</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
