"use client";
import { useState } from "react";

interface StoreItem {
  id: string;
  name: string;
  domain: string;
  currency: string;
  language: string;
  taxProfile: string;
  status: "Active" | "Maintenance";
}

interface VendorItem {
  id: string;
  shopName: string;
  owner: string;
  email: string;
  commissionRate: number; // percentage e.g. 15%
  totalSales: string;
  payoutDue: string;
  status: "Approved" | "Pending" | "Suspended";
}

export default function MultiStoreVendorPage() {
  const [activeTab, setActiveTab] = useState<"stores" | "vendors">("stores");

  // Stores State
  const [stores, setStores] = useState<StoreItem[]>([
    { id: "s1", name: "NexaCommerce US Flagship", domain: "us.nexacommerce.io", currency: "USD ($)", language: "English (US)", taxProfile: "US Sales Tax (State-wise)", status: "Active" },
    { id: "s2", name: "NexaCommerce UK & EU", domain: "uk.nexacommerce.co.uk", currency: "GBP (£)", language: "English / French", taxProfile: "VAT 20% Included", status: "Active" },
    { id: "s3", name: "NexaCommerce UAE & GCC", domain: "ae.nexacommerce.ae", currency: "AED (د.إ)", language: "Arabic / English", taxProfile: "UAE VAT 5%", status: "Active" },
  ]);

  // Vendors State
  const [vendors, setVendors] = useState<VendorItem[]>([
    { id: "v1", shopName: "Aesthetic Wear Hub", owner: "Mohsin Shahzad", email: "mohsin@aestheticwear.com", commissionRate: 12, totalSales: "$14,520.00", payoutDue: "$1,240.00", status: "Approved" },
    { id: "v2", shopName: "Global Tech Gadgets", owner: "Alex Turner", email: "alex@techgadgets.io", commissionRate: 15, totalSales: "$32,800.00", payoutDue: "$4,150.00", status: "Approved" },
    { id: "v3", shopName: "Organic Artisan Crafts", owner: "Fatima Al-Mansoori", email: "fatima@artisan.ae", commissionRate: 10, totalSales: "$4,200.00", payoutDue: "$380.00", status: "Pending" },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [storeModal, setStoreModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);

  // New Store Form State
  const [newStoreName, setNewStoreName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newCurrency, setNewCurrency] = useState("USD ($)");

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newDomain) return;
    const newStore: StoreItem = {
      id: `s_${Date.now()}`,
      name: newStoreName,
      domain: newDomain,
      currency: newCurrency,
      language: "English (Global)",
      taxProfile: "Standard Auto-Tax",
      status: "Active"
    };
    setStores([...stores, newStore]);
    setNotification(`New store "${newStoreName}" deployed successfully! 🌍`);
    setNewStoreName("");
    setNewDomain("");
    setStoreModal(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleVendorStatus = (id: string) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === "Approved" ? "Suspended" : "Approved";
        setNotification(`Vendor "${v.shopName}" status updated to ${nextStatus}`);
        return { ...v, status: nextStatus };
      }
      return v;
    }));
    setTimeout(() => setNotification(null), 3000);
  };

  const processPayout = (shopName: string, amount: string) => {
    setNotification(`Payout of ${amount} successfully processed for "${shopName}" via Gateway! 💸`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Multi-Store & Multi-Vendor SaaS Hub 🌍</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage multiple storefront domains, localized currencies, regional tax profiles, and vendor marketplace operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { if(activeTab === 'stores') setStoreModal(true); else setVendorModal(true); }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {activeTab === 'stores' ? '+ Add New Storefront' : '+ Invite New Vendor'}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("stores")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "stores" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🌐 Multi-Store & Domains ({stores.length})
        </button>
        <button
          onClick={() => setActiveTab("vendors")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "vendors" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🤝 Multi-Vendor Marketplace & Commissions ({vendors.length})
        </button>
      </div>

      {/* TAB 1: STORES */}
      {activeTab === "stores" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">
                      {store.currency}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {store.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">{store.name}</h3>
                    <p className="text-xs font-mono font-medium text-indigo-500 mt-0.5">{store.domain}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span className="font-bold">Language:</span>
                      <span>{store.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Tax Profile:</span>
                      <span>{store.taxProfile}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400">Multi-Region Engine</span>
                  <button 
                    onClick={() => setNotification(`Configuring settings for ${store.name}`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Configure Store ⚙️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VENDORS */}
      {activeTab === "vendors" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-gray-900">Vendor Directory, Commissions & Payouts</h3>
            <span className="text-xs font-bold text-gray-500">Platform Commission Engine Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <th className="p-4">Shop & Owner</th>
                  <th className="p-4">Commission Rate</th>
                  <th className="p-4">Total Sales</th>
                  <th className="p-4">Pending Payout</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900">{v.shopName}</div>
                      <div className="text-gray-400 text-[11px]">{v.owner} ({v.email})</div>
                    </td>
                    <td className="p-4 font-bold text-indigo-600">{v.commissionRate}% platform fee</td>
                    <td className="p-4 font-bold">{v.totalSales}</td>
                    <td className="p-4 font-extrabold text-emerald-600">{v.payoutDue}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        v.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        v.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => processPayout(v.shopName, v.payoutDue)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
                      >
                        Pay Payout 💸
                      </button>
                      <button 
                        onClick={() => toggleVendorStatus(v.id)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition cursor-pointer"
                      >
                        {v.status === 'Approved' ? 'Suspend' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Store Modal */}
      {storeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-base font-extrabold text-gray-900">Deploy New Storefront</h3>
              <button onClick={() => setStoreModal(false)} className="text-gray-400 hover:text-gray-600 font-extrabold text-lg">✕</button>
            </div>

            <form onSubmit={handleAddStore} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={newStoreName} 
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="e.g. NexaCommerce Canada" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Store Domain / Subdomain</label>
                <input 
                  type="text" 
                  value={newDomain} 
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="ca.nexacommerce.io" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Default Currency</label>
                <select 
                  value={newCurrency} 
                  onChange={(e) => setNewCurrency(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="CAD ($)">CAD ($)</option>
                  <option value="PKR (Rs)">PKR (Rs)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button 
                  type="button" 
                  onClick={() => setStoreModal(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Deploy Store 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}