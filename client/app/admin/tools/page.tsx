"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Search,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Clock,
  Slash,
  AlertCircle,
  X,
  Save,
  Check,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { tools } from "@/lib/tools-registry";
import { useAdmin } from "@/components/admin/AdminContext";

interface ToolOverride {
  slug: string;
  name: string;
  category: string;
  status: "active" | "upcoming" | "draft" | "disabled";
  featured: boolean;
  customTitle?: string;
  customDescription?: string;
  notes?: string;
}

interface ToolUsageStat {
  uses: number;
  uniqueUsers: number;
}

export default function ToolsManagementPage() {
  const { token, refreshKey, apiBase, showToast } = useAdmin();
  const [overrides, setOverrides] = useState<Record<string, ToolOverride>>({});
  const [usageStats, setUsageStats] = useState<Record<string, ToolUsageStat>>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Edit Modal State
  const [editingTool, setEditingTool] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState<"active" | "upcoming" | "draft" | "disabled">("active");
  const [editNotes, setEditNotes] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchToolData() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/tools`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (active) {
            const map: Record<string, ToolOverride> = {};
            (json.overrides || []).forEach((o: ToolOverride) => {
              map[o.slug] = o;
            });
            setOverrides(map);
            setUsageStats(json.usageStats || {});
          }
        }
      } catch (err) {
        console.error("Error fetching tools:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchToolData();
    return () => {
      active = false;
    };
  }, [token, refreshKey, apiBase]);

  // Merge static registry tools with dynamic overrides
  const allTools = tools.map((t) => {
    const override = overrides[t.slug];
    const stat = usageStats[t.slug] || { uses: 0, uniqueUsers: 0 };
    return {
      ...t,
      status: override?.status || "active",
      notes: override?.notes || "",
      uses: stat.uses,
      uniqueUsers: stat.uniqueUsers,
      hasCustomNotes: Boolean(override?.notes),
    };
  });

  const categories = ["all", "text", "image", "seo"];
  const statuses = ["all", "active", "upcoming", "draft", "disabled"];

  const filteredTools = allTools.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleStatusChange = async (
    slug: string,
    toolName: string,
    newStatus: "active" | "upcoming" | "draft" | "disabled"
  ) => {
    try {
      const res = await fetch(`${apiBase}/api/tools/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: toolName, status: newStatus }),
      });

      if (res.ok) {
        setOverrides((prev) => ({
          ...prev,
          [slug]: {
            ...prev[slug],
            slug,
            name: toolName,
            category: prev[slug]?.category || "other",
            status: newStatus,
            featured: prev[slug]?.featured || false,
          },
        }));
        showToast(`${toolName} marked as ${newStatus}`, "success");
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Network error updating status", "error");
    }
  };

  const handleSaveModal = async () => {
    if (!editingTool) return;
    setEditSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/tools/${editingTool.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingTool.name,
          status: editStatus,
          notes: editNotes,
        }),
      });

      if (res.ok) {
        setOverrides((prev) => ({
          ...prev,
          [editingTool.slug]: {
            ...prev[editingTool.slug],
            slug: editingTool.slug,
            name: editingTool.name,
            category: editingTool.category,
            status: editStatus,
            featured: prev[editingTool.slug]?.featured || false,
            notes: editNotes,
          },
        }));
        showToast(`Metadata updated for ${editingTool.name}`, "success");
        setEditingTool(null);
      } else {
        showToast("Failed to save changes", "error");
      }
    } catch {
      showToast("Network error saving tool", "error");
    } finally {
      setEditSaving(false);
    }
  };

  const statusBadges = {
    active: { label: "Active", bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: CheckCircle2 },
    upcoming: { label: "Upcoming", bg: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
    draft: { label: "Draft", bg: "bg-slate-100 text-slate-700 border-slate-200/60", icon: Slash },
    disabled: { label: "Disabled", bg: "bg-rose-50 text-rose-700 border-rose-200/60", icon: AlertCircle },
  };

  return (
    <AdminLayout pageTitle="Tools Management" showDateRange={false}>
      <div className="space-y-6">
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Tools Catalog Management</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Control visibility, review execution statistics, and modify status for all {allTools.length} Kraviona tools.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools by name, slug, or keywords..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <div className="text-xs text-slate-500 font-mono self-end sm:self-auto">
              {filteredTools.length} of {allTools.length} tools
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 mr-1 uppercase">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 mr-1 uppercase">Status:</span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    selectedStatus === st
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Tool Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Usage Count</th>
                  <th className="py-3 px-4">SEO Metadata</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No tools found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTools.map((tool) => {
                    const badge = statusBadges[tool.status as keyof typeof statusBadges] || statusBadges.active;
                    const BadgeIcon = badge.icon;

                    return (
                      <tr key={tool.slug} className="hover:bg-slate-50/70 transition-colors">
                        {/* Tool name & slug */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Wrench className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{tool.name}</div>
                              <div className="text-[11px] font-mono text-slate-400">/tools/{tool.slug}</div>
                              {tool.notes && (
                                <div className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block border border-amber-200/50">
                                  Note: {tool.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 capitalize">
                            {tool.category}
                          </span>
                        </td>

                        {/* Status switcher */}
                        <td className="py-3.5 px-4">
                          <select
                            value={tool.status}
                            onChange={(e) =>
                              handleStatusChange(
                                tool.slug,
                                tool.name,
                                e.target.value as "active" | "upcoming" | "draft" | "disabled"
                              )
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.bg}`}
                          >
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="draft">Draft</option>
                            <option value="disabled">Disabled</option>
                          </select>
                        </td>

                        {/* Usage stats */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-mono font-bold text-slate-900">{tool.uses.toLocaleString()} uses</div>
                          <div className="text-[10px] font-mono text-slate-400">{tool.uniqueUsers} users</div>
                        </td>

                        {/* SEO status */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Title & Meta configured</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingTool(tool);
                                setEditStatus(tool.status as any);
                                setEditNotes(tool.notes || "");
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit Tool Notes / Meta"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/tools/${tool.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                              title="View Live Tool"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Tool Metadata Modal */}
        {editingTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Tool Settings</h3>
                  <p className="text-xs text-slate-400 font-mono">{editingTool.name}</p>
                </div>
                <button
                  onClick={() => setEditingTool(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tool Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="active">Active (Visible and fully interactive)</option>
                    <option value="upcoming">Upcoming (Marked with release badge)</option>
                    <option value="draft">Draft (Hidden from public catalog)</option>
                    <option value="disabled">Disabled (Temporarily deactivated)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="E.g. Performance optimizations scheduled, new presets to add..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingTool(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  disabled={editSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editSaving ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
