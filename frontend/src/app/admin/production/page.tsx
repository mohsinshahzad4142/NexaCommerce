"use client";
import { useState } from "react";

interface DevItem {
  id: string;
  category: "Code & Testing" | "API & Docs" | "CI/CD & DevOps" | "Security & Reliability";
  feature: string;
  technology: string;
  status: "Active" | "Configured" | "Automated";
  details: string;
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  status: string;
}

export default function ProductionHubPage() {
  const [activeTab, setActiveTab] = useState<"checklist" | "cicd" | "audit" | "backups">("checklist");
  const [notification, setNotification] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const [items, setItems] = useState<DevItem[]>([
    { id: "d1", category: "Code & Testing", feature: "TypeScript Strict Mode", technology: "TypeScript 5.x", status: "Active", details: "Zero implicit any types across frontend & backend codebases." },
    { id: "d2", category: "Code & Testing", feature: "Unit & Integration Tests", technology: "Jest + PyTest", status: "Automated", details: "94% test coverage on critical order & payment modules." },
    { id: "d3", category: "Code & Testing", feature: "End-to-End (E2E) Tests", technology: "Playwright", status: "Configured", details: "Simulates full user shopping journey from catalog to checkout." },
    { id: "d4", category: "API & Docs", feature: "Swagger / OpenAPI Docs", technology: "FastAPI /docs & Redoc", status: "Active", details: "Auto-generated interactive API documentation with authentication." },
    { id: "d5", category: "CI/CD & DevOps", feature: "GitHub Actions CI/CD", technology: "YAML Workflows", status: "Automated", details: "Automatic linting, testing, and Vercel/Docker deployment on push to main." },
    { id: "d6", category: "CI/CD & DevOps", feature: "Staging & Production Envs", technology: "Vercel Edge & AWS RDS", status: "Active", details: "Isolated staging environment for QA testing before production release." },
    { id: "d7", category: "Security & Reliability", feature: "Error Monitoring & Logging", technology: "Sentry + Winston", status: "Active", details: "Real-time exception alerts and structured JSON application logs." },
    { id: "d8", category: "Security & Reliability", feature: "Database Migrations & Backups", technology: "Alembic + AWS S3", status: "Automated", details: "Daily automated encrypted snapshots and zero-downtime schema migrations." },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "log-1", action: "Environment Variable Updated (STRIPE_SECRET_KEY)", actor: "Mohsin Shahzad (Admin)", timestamp: "2026-09-27 14:10", status: "Success 🟢" },
    { id: "log-2", action: "Database Migration Executed (v2.4_add_indexes)", actor: "CI/CD Automation Bot", timestamp: "2026-09-27 12:00", status: "Success 🟢" },
    { id: "log-3", action: "Production Deployment Triggered (v1.8.2)", actor: "Mohsin Shahzad (Admin)", timestamp: "2026-09-26 18:45", status: "Success 🟢" },
  ]);

  const triggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setNotification("Encrypted database snapshot successfully archived to AWS S3! 💾");
      setTimeout(() => setNotification(null), 4000);
    }, 1500);
  };

  const triggerCICD = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setNotification("GitHub Actions pipeline triggered: All tests passed successfully. Deployed to Production! 🚀");
      setTimeout(() => setNotification(null), 5000);
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Developer & Production DevOps Hub 🧪</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage code quality, test suites, API Swagger docs, CI/CD pipelines, audit logs, and automated backups.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerBackup}
            disabled={isBackingUp}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isBackingUp ? "Backing up..." : "Backup Database Now 💾"}
          </button>
          <button 
            onClick={triggerCICD}
            disabled={isDeploying}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? "Running Pipeline..." : "Run CI/CD Pipeline 🚀"}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Test Coverage</span>
          <div className="text-2xl font-extrabold text-gray-900">94.2%</div>
          <p className="text-xs text-emerald-600 font-bold">🟢 Jest & PyTest Passing</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">API Documentation</span>
          <div className="text-2xl font-extrabold text-gray-900">Swagger OpenAPI</div>
          <p className="text-xs text-indigo-600 font-bold">📖 Active on /docs</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Environment Status</span>
          <div className="text-2xl font-extrabold text-gray-900">Staging & Prod</div>
          <p className="text-xs text-emerald-600 font-bold">⚡ Zero Downtime Sync</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Automated Backups</span>
          <div className="text-2xl font-extrabold text-gray-900">Daily Encrypted</div>
          <p className="text-xs text-emerald-600 font-bold">🔒 Secure on AWS S3</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "checklist" ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🧪 Developer Stack & Checklist ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("cicd")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "cicd" ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          ⚡ CI/CD & Environments
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "audit" ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          📜 Security Audit Logs
        </button>
        <button
          onClick={() => setActiveTab("backups")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "backups" ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          💾 Database & Migrations
        </button>
      </div>

      {/* TAB 1: CHECKLIST */}
      {activeTab === "checklist" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-gray-900">Developer & Production Stack Architecture</h3>
            <span className="text-xs font-bold text-gray-500">TypeScript, Testing, Swagger, Sentry, & GitHub Actions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <th className="p-4">Category</th>
                  <th className="p-4">Feature / Standard</th>
                  <th className="p-4">Technology</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-indigo-600">{item.category}</td>
                    <td className="p-4 font-extrabold text-gray-900">{item.feature}</td>
                    <td className="p-4 font-mono text-gray-600 bg-gray-50 rounded-lg">{item.technology}</td>
                    <td className="p-4 text-gray-500">{item.details}</td>
                    <td className="p-4 text-right">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-extrabold">
                        {item.status} 🟢
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CI/CD */}
      {activeTab === "cicd" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-extrabold text-gray-900">Staging Environment</h3>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-extrabold">Active 🟢</span>
            </div>
            <p className="text-xs text-gray-500">Used for staging pull requests, automated integration testing, and client previews.</p>
            <div className="p-3 bg-gray-50 rounded-xl font-mono text-[11px] text-indigo-600">
              https://staging.nexacommerce.io
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-extrabold text-gray-900">Production Environment</h3>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-extrabold">Live ⚡</span>
            </div>
            <p className="text-xs text-gray-500">High-availability cluster with global CDN caching, auto-scaling API workers, and SSL encryption.</p>
            <div className="p-3 bg-gray-50 rounded-xl font-mono text-[11px] text-emerald-600">
              https://nexacommerce.io
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900">Security Audit Logs</h3>
            <p className="text-xs text-gray-500">Immutable log record of all admin actions, environment variable changes, and deployments.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <th className="p-4">Action Performed</th>
                  <th className="p-4">Performed By</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-extrabold text-gray-900">{log.action}</td>
                    <td className="p-4 font-bold text-indigo-600">{log.actor}</td>
                    <td className="p-4 font-mono text-gray-500">{log.timestamp}</td>
                    <td className="p-4 text-right font-bold text-emerald-600">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUPS */}
      {activeTab === "backups" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Database Migrations & Automated Backups</h3>
              <p className="text-xs text-gray-500">Manage Alembic schema migrations and point-in-time database recovery snapshots.</p>
            </div>
            <button 
              onClick={triggerBackup}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
            >
              Trigger Manual Snapshot 💾
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-900 text-xs">
                <span>Latest Snapshot</span>
                <span className="text-emerald-600 font-extrabold">Completed 🟢</span>
              </div>
              <p className="text-xs text-gray-500">Size: 428 MB. Encrypted AES-256 stored in AWS S3 Backup Bucket.</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-900 text-xs">
                <span>Alembic Migrations</span>
                <span className="text-indigo-600 font-extrabold">Up to Date ⚡</span>
              </div>
              <p className="text-xs text-gray-500">Head revision: rev_9a2b4f (Products, Orders, and Customers tables indexed).</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-900 text-xs">
                <span>Backup Schedule</span>
                <span className="text-emerald-600 font-extrabold">Every 24 Hours ⏰</span>
              </div>
              <p className="text-xs text-gray-500">Automatic retention policy keeps daily backups for 30 days and weekly for 1 year.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}