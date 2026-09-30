"use client";
import { useState } from "react";

export default function ShippingManagementPage() {
  const [activeTab, setActiveTab] = useState("shipments");

  // Active Shipments State
  const [shipments, setShipments] = useState([
    { id: "TRK-98214-TCS", orderNo: "NEXA-98214", customer: "Mohsin Shahzad", courier: "TCS Pakistan", destination: "Lahore", weight: "1.5 kg", cost: "Rs. 325", estDelivery: "2026-09-28", status: "In Transit" },
    { id: "TRK-88342-LEPS", orderNo: "NEXA-88342", customer: "Sarah Connor", courier: "Leopards Courier", destination: "Karachi", weight: "0.8 kg", cost: "Rs. 350", estDelivery: "2026-09-26", status: "Out for Delivery" },
    { id: "TRK-77219-MNP", orderNo: "NEXA-77219", customer: "David Miller", courier: "M&P Express", destination: "Islamabad", weight: "2.0 kg", cost: "Rs. 350", estDelivery: "2026-09-25", status: "Delivered" },
  ]);

  // Courier APIs Configuration State
  const [couriers, setCouriers] = useState([
    { id: "tcs", name: "TCS API Gateway", status: "Connected", apiKey: "tcs_live_998234xyz", endpoint: "https://api.tcspakistan.com/v1/dispatch" },
    { id: "leopards", name: "Leopards API Gateway", status: "Connected", apiKey: "lep_prod_445789abc", endpoint: "https://api.leopards.pk/ws/v2/" },
    { id: "mnp", name: "M&P Express API", status: "Sandbox Mode", apiKey: "mnp_test_112233def", endpoint: "https://sandbox.mulphico.pk/api/" },
  ]);

  // Tracker Tool State
  const [searchCode, setSearchCode] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = shipments.find(s => s.id.toLowerCase().includes(searchCode.toLowerCase()) || s.orderNo.toLowerCase().includes(searchCode.toLowerCase()));
    setTrackResult(found || "not_found");
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Shipping & Courier Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure shipping zones, flat/weight rates, live tracking & TCS, Leopards, M&P courier dispatch APIs.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            Courier Gateway: Operational
          </span>
        </div>
      </div>

      {/* Navigation Tabs - Now 4 Clean Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        {[
          { id: "shipments", label: "📦 Active Shipments & Tracking" },
          { id: "zones", label: "🗺️ Shipping Zones & Rates" },
          { id: "apis", label: "🔌 Courier Dispatch APIs" },
          { id: "tracker", label: "🔍 Public Tracker Tool" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ACTIVE SHIPMENTS */}
      {activeTab === "shipments" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-gray-900">Assigned Packages & Live Courier Status</h3>
            <span className="text-xs font-bold text-gray-400">Total Active: {shipments.length}</span>
          </div>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Tracking No. / Order</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Courier</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Weight / Cost</th>
                  <th className="py-3 px-4">Est. Delivery</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {shipments.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">{s.id}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{s.orderNo}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold">{s.customer}</td>
                    <td className="py-4 px-4 text-indigo-600 font-bold">{s.courier}</td>
                    <td className="py-4 px-4 text-gray-600">{s.destination}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold">{s.weight}</p>
                      <p className="text-[11px] text-gray-400">{s.cost}</p>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-medium">{s.estDelivery}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : s.status === 'Out for Delivery' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ZONES & RATES */}
      {activeTab === "zones" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { zone: "Punjab & Capital", flat: "Rs. 250", cities: "Lahore, Islamabad, Rawalpindi, Faisalabad, Multan", threshold: "Rs. 3000", surcharge: "Rs. 50 per kg" },
            { zone: "Sindh Region", flat: "Rs. 350", cities: "Karachi, Hyderabad, Sukkur", threshold: "Rs. 4000", surcharge: "Rs. 70 per kg" },
            { zone: "KPK & Balochistan", flat: "Rs. 450", cities: "Peshawar, Quetta, Abbottabad, Swat", threshold: "Rs. 5000", surcharge: "Rs. 90 per kg" },
            { zone: "International Worldwide", flat: "Rs. 2500", cities: "New York, London, Dubai, Toronto", threshold: "Rs. 15000", surcharge: "Rs. 500 per kg" },
          ].map((z, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-gray-900">{z.zone}</h3>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">Flat Rate: {z.flat}</span>
              </div>
              <p className="text-xs text-gray-500">{z.cities}</p>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-medium text-gray-600">
                <span>Free Threshold: <strong className="text-gray-900">{z.threshold}</strong></span>
                <span>Surcharge: <strong className="text-gray-900">{z.surcharge}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COURIER DISPATCH APIS (TCS, LEOPARDS, M&P) */}
      {activeTab === "apis" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Courier Dispatch API Integrations</h3>
            <p className="text-xs text-gray-500">Configure API keys and webhooks for automated label generation and booking with Pakistani courier partners.</p>
          </div>

          <div className="space-y-4">
            {couriers.map(c => (
              <div key={c.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-gray-900 text-xs">{c.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono">Endpoint: {c.endpoint}</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input type="password" value={c.apiKey} readOnly className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-600 w-48" />
                  <button onClick={() => alert(`${c.name} settings updated successfully!`)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition whitespace-nowrap">
                    Configure Keys
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PUBLIC TRACKER TOOL */}
      {activeTab === "tracker" && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6 text-center">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Track Your Shipment</h3>
            <p className="text-xs text-gray-500 mt-0.5">Enter Tracking Number (e.g., TRK-98214-TCS) or Order ID to check live delivery status.</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Tracking No. or Order ID..."
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium flex-1 focus:outline-none focus:border-indigo-500"
              required
            />
            <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition">
              Track Package 🔍
            </button>
          </form>

          {trackResult && trackResult !== "not_found" && (
            <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-left space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-indigo-900">{trackResult.id}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">{trackResult.status}</span>
              </div>
              <p className="text-xs text-gray-600">Customer: <strong className="text-gray-900">{trackResult.customer}</strong> ({trackResult.courier})</p>
              <p className="text-xs text-gray-600">Destination: <strong className="text-gray-900">{trackResult.destination}</strong></p>
              <p className="text-xs text-gray-600">Estimated Delivery: <strong className="text-gray-900">{trackResult.estDelivery}</strong></p>
            </div>
          )}

          {trackResult === "not_found" && (
            <p className="text-xs font-bold text-rose-600">No shipment found with this tracking number or order ID.</p>
          )}
        </div>
      )}
    </div>
  );
}