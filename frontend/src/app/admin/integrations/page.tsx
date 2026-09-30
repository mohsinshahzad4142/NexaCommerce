"use client";
import { useState } from "react";

interface IntegrationItem {
  id: string;
  name: string;
  category: "Core API" | "Payments & Shipping" | "Enterprise CRM/ERP" | "Marketing & Analytics" | "Communication";
  status: boolean;
  description: string;
  badge?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    { id: "i1", name: "REST API v2 Core", category: "Core API", status: true, description: "Full JSON/REST endpoints for products, orders, and customers.", badge: "Active" },
    { id: "i2", name: "GraphQL Endpoint", category: "Core API", status: true, description: "Optional flexible query layer for headless storefronts.", badge: "v1.2" },
    { id: "i3", name: "Webhooks Dispatcher", category: "Core API", status: true, description: "Real-time event subscriptions (order.created, inventory.low).", badge: "14 Listeners" },
    { id: "i4", name: "OAuth 2.0 Provider", category: "Core API", status: true, description: "Secure token-based authorization for third-party apps.", badge: "Secure" },
    { id: "i5", name: "Stripe & PayPal Payment APIs", category: "Payments & Shipping", status: true, description: "Global credit card and digital wallet transaction processing.", badge: "Connected" },
    { id: "i6", name: "FedEx & DHL Shipping APIs", category: "Payments & Shipping", status: true, description: "Live shipping rates calculation and label generation.", badge: "Active" },
    { id: "i7", name: "HubSpot & Salesforce CRM", category: "Enterprise CRM/ERP", status: false, description: "Two-way contact synchronization and sales pipeline tracking.", badge: "Optional" },
    { id: "i8", name: "SAP & Odoo ERP Systems", category: "Enterprise CRM/ERP", status: false, description: "Enterprise resource planning and warehouse management sync.", badge: "Optional" },
    { id: "i9", name: "QuickBooks & Xero Accounting", category: "Enterprise CRM/ERP", status: true, description: "Automated ledger balancing, tax reports, and invoice sync.", badge: "Live Sync" },
    { id: "i10", name: "Google Analytics 4 (GA4)", category: "Marketing & Analytics", status: true, description: "Enhanced e-commerce tracking events and funnel attribution.", badge: "Tracking" },
    { id: "i11", name: "Meta Pixel & Conversions API", category: "Marketing & Analytics", status: true, description: "Server-side event tracking for Facebook & Instagram ads.", badge: "Active" },
    { id: "i12", name: "Google Merchant Center", category: "Marketing & Analytics", status: true, description: "Automated product feed synchronization for Google Shopping.", badge: "Synced" },
    { id: "i13", name: "WhatsApp Business API", category: "Communication", status: true, description: "Automated order updates, shipping alerts, and chat support.", badge: "Connected" },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const nextState = !item.status;
        setNotification(`Integration "${item.name}" has been ${nextState ? 'enabled 🟢' : 'disabled ⚪'}`);
        return { ...item, status: nextState };
      }
      return item;
    }));
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomKey = `nexa_live_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`;
    setGeneratedKey(randomKey);
    setNotification(`API Key "${newKeyName}" successfully generated! 🔑`);
    setNewKeyName("");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">API & Integrations Hub ⚡</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage REST/GraphQL endpoints, webhooks, payment gateways, ERP/CRM sync, and marketing pixels.</p>
        </div>
        <button 
          onClick={() => setApiKeyModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
        >
          + Generate API Key / OAuth
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Grid of All Checklist Integrations */}
      <div className="space-y-6">
        <h3 className="text-base font-extrabold text-gray-900 px-1">Active Protocols & Third-Party Connectors ({integrations.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">
                    {item.category}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-extrabold text-gray-900">{item.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-400">Status</span>
                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shadow-sm cursor-pointer ${
                    item.status 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {item.status ? "Connected 🟢" : "Disconnected ⚪"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Generator Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-base font-extrabold text-gray-900">Generate Secure API Key</h3>
              <button onClick={() => { setApiKeyModal(false); setGeneratedKey(null); }} className="text-gray-400 hover:text-gray-600 font-extrabold text-lg">✕</button>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Key Label / App Name</label>
                <input 
                  type="text" 
                  value={newKeyName} 
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Mobile App Sync / ERP Connector" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required 
                />
              </div>

              {generatedKey && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase">Your Secret API Key (Copy Now)</span>
                  <p className="text-xs font-mono font-bold text-emerald-900 break-all bg-white p-2 rounded-xl border border-emerald-100">{generatedKey}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button 
                  type="button" 
                  onClick={() => { setApiKeyModal(false); setGeneratedKey(null); }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Generate Key 🔑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}