"use client";

import React, { useEffect, useState } from "react";
import {
  KeyRound,
  Plus,
  Trash2,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Radio,
  Zap,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";

interface ApiConfig {
  _id: string;
  provider: string;
  endpoint: string;
  secretEnvName: string;
  enabled: boolean;
  requestLimit: number;
  notes?: string;
  hasEnvSecret?: boolean;
  maskedKeyPreview?: string;
}

export default function ApiManagementPage() {
  const { token, apiBase, showToast } = useAdmin();
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; status: string; latency: number } | null>(null);

  // New API Form
  const [newProvider, setNewProvider] = useState("");
  const [newEndpoint, setNewEndpoint] = useState("");
  const [newSecretEnv, setNewSecretEnv] = useState("");
  const [newLimit, setNewLimit] = useState(1000);
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadConfigs() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/configured-apis`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setConfigs(json.configs || []);
        }
      } catch (err) {
        console.error("Failed to load API configs:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadConfigs();
    return () => {
      active = false;
    };
  }, [token, apiBase]);

  const handleToggle = async (id: string, currentStatus: boolean, providerName: string) => {
    try {
      const res = await fetch(`${apiBase}/api/configured-apis/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (res.ok) {
        setConfigs((prev) =>
          prev.map((c) => (c._id === id ? { ...c, enabled: !currentStatus } : c))
        );
        showToast(`${providerName} ${!currentStatus ? "activated" : "deactivated"}`, "info");
      }
    } catch {
      showToast("Failed to toggle API status", "error");
    }
  };

  const handleDelete = async (id: string, providerName: string) => {
    if (!confirm(`Delete API configuration for ${providerName}?`)) return;

    try {
      const res = await fetch(`${apiBase}/api/configured-apis/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setConfigs((prev) => prev.filter((c) => c._id !== id));
        showToast(`Deleted ${providerName} configuration`, "success");
      }
    } catch {
      showToast("Error deleting API configuration", "error");
    }
  };

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await fetch(`${apiBase}/api/configured-apis/${id}/test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTestResult({
        id,
        status: data.pingStatus,
        latency: data.pingLatencyMs || 0,
      });
      showToast(`Ping completed: ${data.pingStatus} (${data.pingLatencyMs}ms)`, "info");
    } catch {
      showToast("Ping failed to execute", "error");
    } finally {
      setTestingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/configured-apis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: newProvider.trim(),
          endpoint: newEndpoint.trim(),
          secretEnvName: newSecretEnv.trim(),
          requestLimit: Number(newLimit) || 0,
          notes: newNotes.trim(),
          enabled: true,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setConfigs([...configs, json.config]);
        showToast(`Created ${newProvider} configuration`, "success");
        setModalOpen(false);
        setNewProvider("");
        setNewEndpoint("");
        setNewSecretEnv("");
        setNewNotes("");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to create API config", "error");
      }
    } catch {
      showToast("Network error creating API config", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="API Management" showDateRange={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">External API Integrations</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Securely register third-party endpoints, monitor rate quotas, and audit secret keys.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Security Disclosure Notice */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3.5 text-xs shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200">Zero Secret Leakage Guarantee</span>
            <p className="text-slate-400 leading-relaxed">
              API secrets and private access tokens are never transmitted to the browser or stored in client bundles. Configurations map to backend environment variables (e.g. <code className="text-violet-300 font-mono">OPENAI_API_KEY</code>), ensuring keys remain safeguarded in the isolated server runtime.
            </p>
          </div>
        </div>

        {/* Configured APIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
            ))
          ) : configs.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <KeyRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-800">No external APIs configured</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Connect third-party services like image optimization APIs, AI completions, or verification endpoints.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
              >
                <Plus className="w-3 h-3" />
                <span>Configure First API</span>
              </button>
            </div>
          ) : (
            configs.map((c) => {
              const test = testResult?.id === c._id ? testResult : null;
              return (
                <div
                  key={c._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top row: Provider & Enabled Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
                          {c.provider.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{c.provider}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                c.enabled
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${c.enabled ? "bg-emerald-500" : "bg-slate-400"}`} />
                              {c.enabled ? "Enabled" : "Disabled"}
                            </span>
                            {c.hasEnvSecret ? (
                              <span className="text-[10px] text-emerald-600 font-medium">✓ Secret Loaded</span>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-medium">⚠ Key missing in .env</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={c.enabled}
                          onChange={() => handleToggle(c._id, c.enabled, c.provider)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    {/* Endpoint & Secret Variable Info */}
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold uppercase text-[10px]">Endpoint:</span>
                        <div className="font-mono text-slate-700 truncate bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-0.5">
                          {c.endpoint}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[10px]">Secret Env Var:</span>
                          <div className="font-mono text-slate-800 font-semibold">{c.secretEnvName}</div>
                        </div>
                        <div className="text-right font-mono text-slate-400">
                          {c.maskedKeyPreview || "••••••••"}
                        </div>
                      </div>

                      {c.notes && (
                        <div className="text-[11px] text-slate-500 italic pt-1">
                          Note: {c.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions & Test Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleTestConnection(c._id)}
                      disabled={testingId === c._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors disabled:opacity-50"
                    >
                      <Zap className={`w-3.5 h-3.5 ${testingId === c._id ? "animate-spin" : ""}`} />
                      <span>{testingId === c._id ? "Testing..." : "Test Endpoint"}</span>
                    </button>

                    {test && (
                      <span className="text-[11px] font-mono text-slate-600">
                        {test.status} ({test.latency}ms)
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(c._id, c.provider)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete configuration"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add API Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add API Integration</h3>
                  <p className="text-xs text-slate-400">Configure connection to external web service</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Provider Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    placeholder="e.g. OpenAI, Cloudflare, Resend"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    API Endpoint URL
                  </label>
                  <input
                    type="url"
                    required
                    value={newEndpoint}
                    onChange={(e) => setNewEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Environment Variable Name for Secret Key
                  </label>
                  <input
                    type="text"
                    required
                    value={newSecretEnv}
                    onChange={(e) => setNewSecretEnv(e.target.value)}
                    placeholder="e.g. OPENAI_API_KEY"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Must correspond to a key defined in your server's .env file.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Daily Request Quota Limit
                  </label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    placeholder="1000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Operational Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Used for image background removal..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Integration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
