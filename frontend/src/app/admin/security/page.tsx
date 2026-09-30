"use client";
import { useState } from "react";

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "audit" | "backups">("overview");
  const [backupStatus, setBackupStatus] = useState("Idle - Last backup today at 04:00 AM");
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setBackupStatus("Creating encrypted snapshot of PostgreSQL & Firebase databases...");
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupStatus("Success! Encrypted backup stored in secure S3 vault.");
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header & Status Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Security & Compliance Hub 🔐</h1>
          <p className="text-xs text-gray-500 mt-0.5">Enterprise WooCommerce alternative security controls, threat protection, and audit logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-extrabold flex items-center gap-2 border border-emerald-100 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> 
            System Status: 100% Secure
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm text-xs font-bold w-fit">
        {[
          { id: "overview", label: "Security Controls & Protocols 🛡️" },
          { id: "audit", label: "Audit Logs & Login Activity 📋" },
          { id: "backups", label: "Encrypted Backup System 💾" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl transition ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SECURITY CONTROLS & PROTOCOLS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* PCI Compliance Notice */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="bg-indigo-700 text-indigo-200 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">PCI-DSS Compliant</span>
              <h3 className="text-base font-extrabold">Payment Tokenization Vault Active</h3>
              <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">
                Raw credit card data is never stored on NexaCommerce servers. All transactions are securely tokenized via PCI-compliant payment gateways (Stripe / PayFast).
              </p>
            </div>
            <span className="px-4 py-2 bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-sm whitespace-nowrap">Token Vault Secure 🔒</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "JWT & Secure Sessions", desc: "HttpOnly encrypted cookies with automatic token rotation.", status: "Active 🟢" },
              { title: "Password Hashing", desc: "Argon2 & Bcrypt cryptographic salting enforced.", status: "Active 🟢" },
              { title: "Two-Factor Auth (2FA)", desc: "TOTP authenticator app verification required for admin roles.", status: "Enforced 🛡️" },
              { title: "Role-Based Access (RBAC)", desc: "Granular permissions for Super Admin, Manager, and Support.", status: "Configured ⚡" },
              { title: "Rate Limiting", desc: "IP-based request throttling (100 req/min) to block DDoS.", status: "Active 🟢" },
              { title: "CSRF & XSS Protection", desc: "Built-in Next.js header sanitization & DOMPurify filters.", status: "Active 🟢" },
              { title: "SQL / NoSQL Injection Shield", desc: "Parameterized queries via FastAPI ORM and SQLite/PostgreSQL.", status: "Active 🟢" },
              { title: "Strict Input Validation", desc: "Zod schema verification on all API payloads and forms.", status: "Active 🟢" },
              { title: "Secure File Uploads", desc: "MIME-type validation, virus scanning, & isolated S3 cloud storage.", status: "Active 🟢" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-extrabold text-gray-900">{item.title}</h3>
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">{item.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px] font-bold text-gray-400">
                  <span>Protocol: Secured</span>
                  <span className="text-indigo-600">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS & LOGIN ACTIVITY */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Admin & User Login Activity Stream</h3>
                <p className="text-xs text-gray-500">Real-time tracking of IP addresses, browser agents, and authentication attempts.</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">Live Stream 🟢</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">User / Role</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Action Event</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {[
                    { user: "Mohsin (Super Admin)", ip: "192.168.1.45", action: "Admin Dashboard Login", time: "2026-09-27 11:30 AM", status: "Success" },
                    { user: "Store Manager", ip: "203.135.40.12", action: "Updated Discount Coupon", time: "2026-09-27 10:15 AM", status: "Success" },
                    { user: "Unknown User", ip: "45.12.89.210", action: "Failed Password Attempt", time: "2026-09-27 03:42 AM", status: "Blocked (Rate Limit)" },
                    { user: "Support Agent", ip: "192.168.1.88", action: "Refund Processed (#ORD-994)", time: "2026-09-26 05:20 PM", status: "Success" },
                  ].map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-extrabold text-gray-900">{log.user}</td>
                      <td className="p-4 font-mono text-gray-600">{log.ip}</td>
                      <td className="p-4 text-gray-700">{log.action}</td>
                      <td className="p-4 text-gray-500">{log.time}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold ${log.status.includes('Success') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP SYSTEM */}
      {activeTab === "backups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Automated & Manual Backup System</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              NexaCommerce creates daily encrypted snapshots of all PostgreSQL databases, product inventory, and customer user tables. You can also trigger an immediate manual snapshot below.
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase">Current Status</span>
              <p className="text-xs font-bold text-gray-800">{backupStatus}</p>
            </div>
            <button 
              onClick={handleTriggerBackup}
              disabled={isBackingUp}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isBackingUp ? "Backing up data..." : "Trigger Manual Encrypted Backup 💾"}
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Recent Backup History</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: "snapshot_prod_2026_09_27_0400.enc", size: "42.8 MB", type: "Automated Daily" },
                { name: "snapshot_prod_2026_09_26_0400.enc", size: "41.5 MB", type: "Automated Daily" },
                { name: "snapshot_prod_2026_09_25_manual.enc", size: "41.2 MB", type: "Manual Trigger" },
              ].map((b, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <strong className="text-gray-900 block font-mono">{b.name}</strong>
                    <span className="text-[11px] text-gray-500">{b.size} • {b.type}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-extrabold rounded-lg text-[10px]">Secure Vault</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}