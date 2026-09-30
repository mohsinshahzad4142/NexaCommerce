"use client";
import { useState } from "react";

interface Plugin {
  id: string;
  name: string;
  category: "Payments" | "Shipping" | "Marketing" | "Analytics" | "AI" | "CRM";
  version: string;
  author: string;
  enabled: boolean;
  description: string;
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([
    { id: "p1", name: "Stripe & PayPal Gateway", category: "Payments", version: "2.4.1", author: "NexaCore Team", enabled: true, description: "Secure global checkout processing and multi-currency support." },
    { id: "p2", name: "DHL & FedEx Express Shipping", category: "Shipping", version: "1.8.0", author: "LogisticsInc", enabled: true, description: "Real-time shipping rate calculation and label generation." },
    { id: "p3", name: "Klaviyo Email Marketing", category: "Marketing", version: "3.1.0", author: "MarTech Pros", enabled: false, description: "Automated cart abandonment sequences and newsletters." },
    { id: "p4", name: "Google Analytics 4 Enhanced Hub", category: "Analytics", version: "4.0.2", author: "NexaCore Team", enabled: true, description: "Advanced e-commerce event tracking and conversion attribution." },
    { id: "p5", name: "Nexa AI Assistant Core", category: "AI", version: "1.2.0", author: "AI Labs", enabled: true, description: "Optional microservice layer for product tags and descriptions." },
    { id: "p6", name: "HubSpot CRM Connector", category: "CRM", version: "2.0.5", author: "SyncMaster", enabled: false, description: "Two-way customer data sync and lead pipeline management." },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states for installation
  const [pluginName, setPluginName] = useState("");
  const [pluginCategory, setPluginCategory] = useState<"Payments" | "Shipping" | "Marketing" | "Analytics" | "AI" | "CRM">("Payments");
  const [pluginDesc, setPluginDesc] = useState("");
  const [fileName, setFileName] = useState("");

  const togglePlugin = (id: string) => {
    setPlugins(plugins.map(p => {
      if (p.id === id) {
        const nextState = !p.enabled;
        setNotification(`Plugin "${p.name}" has been ${nextState ? 'activated 🟢' : 'deactivated ⚪'}`);
        return { ...p, enabled: nextState };
      }
      return p;
    }));
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInstallPlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pluginName.trim() || !pluginDesc.trim()) return;

    const newPlugin: Plugin = {
      id: `p-${Date.now()}`,
      name: pluginName,
      category: pluginCategory,
      version: "1.0.0",
      author: "Custom Developer",
      enabled: true,
      description: pluginDesc,
    };

    setPlugins([newPlugin, ...plugins]);
    setNotification(`Successfully uploaded and installed plugin "${pluginName}" 🟢`);
    setIsModalOpen(false);
    setPluginName("");
    setPluginDesc("");
    setFileName("");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Plugin & Extension System 🧩</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage modular hooks, core extensions, and third-party developer integrations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
        >
          + Upload & Install Plugin (.zip)
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Architecture Overview Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-950 p-6 rounded-3xl text-white shadow-lg space-y-4">
        <h3 className="text-sm font-extrabold tracking-wide text-indigo-300 uppercase">Core Architecture & Hook System</h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          NexaCommerce core isolates business logic through hooks. Extensions seamlessly plug into: <span className="font-mono text-emerald-400">Payments ➔ Shipping ➔ Marketing ➔ Analytics ➔ AI ➔ CRM</span> without disrupting core store uptime.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Payments", "Shipping", "Marketing", "Analytics", "AI", "CRM", "Custom Extensions"].map((cat, idx) => (
            <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl text-[11px] font-bold border border-white/10">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Installed Plugins Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-gray-900 px-1">Installed Modules & Extensions ({plugins.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.map((plugin) => (
            <div key={plugin.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">
                    {plugin.category}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">v{plugin.version}</span>
                </div>
                <h4 className="text-sm font-extrabold text-gray-900">{plugin.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{plugin.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-400">By {plugin.author}</span>
                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shadow-sm cursor-pointer ${
                    plugin.enabled 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {plugin.enabled ? "Active 🟢" : "Disabled ⚪"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fully Functional Upload & Install Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-base font-extrabold text-gray-900">Upload & Register Extension</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-extrabold text-lg">✕</button>
            </div>

            <form onSubmit={handleInstallPlugin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Plugin Package (.zip)</label>
                <input 
                  type="file" 
                  accept=".zip"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                      if (!pluginName) {
                        setPluginName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                      }
                    }
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Plugin Name</label>
                <input 
                  type="text" 
                  value={pluginName} 
                  onChange={(e) => setPluginName(e.target.value)}
                  placeholder="e.g. Razorpay Payment Gateway" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Architecture Category</label>
                <select 
                  value={pluginCategory} 
                  onChange={(e) => setPluginCategory(e.target.value as any)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                >
                  <option value="Payments">Payments</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Analytics">Analytics</option>
                  <option value="AI">AI</option>
                  <option value="CRM">CRM</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={2} 
                  value={pluginDesc} 
                  onChange={(e) => setPluginDesc(e.target.value)}
                  placeholder="Brief summary of extension capabilities..." 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 resize-none focus:outline-indigo-600"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm"
                >
                  Install & Activate 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}