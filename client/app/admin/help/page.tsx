"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Terminal,
  Server,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";

export default function HelpDocsPage() {
  const { showToast } = useAdmin();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    showToast("Command copied to clipboard", "info");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <AdminLayout pageTitle="Help & Documentation" showDateRange={false}>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Platform Operations & Setup Guide</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Documentation on running, testing, deploying, and maintaining Kraviona Tools.
          </p>
        </div>

        {/* Quick Links Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="#analytics-setup"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-300 transition-colors block"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Analytics Tracking</div>
            <div className="text-[11px] text-slate-400 mt-0.5">How visitor telemetry works</div>
          </a>

          <a
            href="#local-run"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-300 transition-colors block"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Run Instructions</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Local development workflow</div>
          </a>

          <a
            href="#deployment"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-300 transition-colors block"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Production Deployment</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Vercel, VPS & PM2 guides</div>
          </a>
        </div>

        {/* Section 1: Analytics Setup */}
        <div id="analytics-setup" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900">1. Privacy-First Analytics Tracking</h3>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Kraviona uses a client tracker mounted in <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">layout.tsx</code>. Every public route navigation automatically broadcasts a <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">page_view</code> event to the Express backend endpoint <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">POST /api/analytics/events</code>.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
            <div className="text-slate-500 font-sans font-semibold">Track Tool Executions from Tool Components:</div>
            <div className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
              {`import { trackToolUsage } from "@/components/analytics/AnalyticsTracker";\n\n// Call on action click\ntrackToolUsage("image-compressor", "Image Compressor");`}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-slate-800">Privacy Safeguards:</div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Raw IP addresses are hashed using SHA-256 with HMAC secret salt.</li>
              <li>Admin portal visits under <code className="font-mono">/admin/*</code> are automatically ignored.</li>
              <li>No third-party tracking cookies or personal identity tracking is used.</li>
            </ul>
          </div>
        </div>

        {/* Section 2: Local Run Instructions */}
        <div id="local-run" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Terminal className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">2. Local Run & Development</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="font-semibold text-slate-800 mb-1">Terminal 1: Start Backend (Port 5000)</div>
              <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                <code>cd backend && npm run dev</code>
                <button
                  onClick={() => handleCopy("cd backend && npm run dev", "cmd-backend")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {copiedSection === "cmd-backend" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-800 mb-1">Terminal 2: Start Next.js Frontend (Port 3000)</div>
              <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                <code>cd client && npm run dev</code>
                <button
                  onClick={() => handleCopy("cd client && npm run dev", "cmd-client")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {copiedSection === "cmd-client" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-800 mb-1">Seed / Provision Admin Account</div>
              <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                <code>cd backend && npm run seed:admin</code>
                <button
                  onClick={() => handleCopy("cd backend && npm run seed:admin", "cmd-seed")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {copiedSection === "cmd-seed" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Default: <span className="font-mono text-slate-700">admin@kraviona.site</span> / <span className="font-mono text-slate-700">Asdf@123</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Deployment Instructions */}
        <div id="deployment" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Server className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">3. Production Deployment Guidelines</h3>
          </div>

          <div className="space-y-4 leading-relaxed text-slate-600">
            <div>
              <div className="font-semibold text-slate-800 mb-1">Architecture Recommendation</div>
              <p>
                Kraviona consists of a decoupled frontend (<code className="font-mono">client</code>) and a Node.js REST API (<code className="font-mono">backend</code>) connected to MongoDB.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-semibold text-slate-800">Deployment Option A: Vercel + Railway / Render</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Deploy <code className="font-mono">client/</code> directly to Vercel. Set <code className="font-mono">NEXT_PUBLIC_API_URL=https://api.yourdomain.com</code>.</li>
                <li>Deploy <code className="font-mono">backend/</code> to Railway or Render with MongoDB Atlas connection string.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-semibold text-slate-800">Deployment Option B: Ubuntu VPS (PM2 + Nginx)</div>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] space-y-1">
                <div>pm2 start backend/app/server.js --name "kraviona-api"</div>
                <div>pm2 start "npm run start" --name "kraviona-web" --cwd client</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
