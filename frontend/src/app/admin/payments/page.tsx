"use client";
import { useState } from "react";

export default function PaymentsManagementPage() {
  const [activeTab, setActiveTab] = useState("gateways");

  // Payment Gateways Architecture State
  const [gateways, setGateways] = useState([
    { id: "cod", name: "Cash on Delivery (COD)", type: "Offline / Manual", status: "Active", fee: "Rs. 0", apiKey: "N/A" },
    { id: "jazzcash", name: "JazzCash / EasyPaisa (Local)", type: "Local API", status: "Active", fee: "1.5%", apiKey: "JC_LIVE_98324729" },
    { id: "stripe", name: "Stripe Credit & Debit Cards", type: "Global API", status: "Active", fee: "2.9% + $0.30", apiKey: "pk_live_51M...xyz" },
    { id: "paypal", name: "PayPal Checkout", type: "Global API", status: "Active", fee: "3.4% + Fixed", apiKey: "client_id_live_8849" },
    { id: "applepay", name: "Apple Pay & Google Pay", type: "Express Wallet", status: "Active", fee: "Standard", apiKey: "merchant_id_apple_99" },
    { id: "banktransfer", name: "Direct Bank Transfer (IBFT)", type: "Manual Verification", status: "Active", fee: "Rs. 0", apiKey: "IBAN: PK09MASH00123" },
    { id: "wallet", name: "NexaCommerce Store Wallet", type: "Internal Credit", status: "Active", fee: "0%", apiKey: "Internal System" },
  ]);

  // Recent Transactions Logs
  const [transactions, setTransactions] = useState([
    { id: "TXN-9081", order: "NEXA-98214", customer: "Mohsin Shahzad", gateway: "JazzCash", amount: "Rs. 4,500", status: "Completed", date: "Today, 02:15 PM" },
    { id: "TXN-9080", order: "NEXA-88342", customer: "Sarah Connor", gateway: "Stripe", amount: "$120.00", status: "Completed", date: "Today, 11:30 AM" },
    { id: "TXN-9079", order: "NEXA-77219", customer: "David Miller", gateway: "Cash on Delivery", amount: "Rs. 2,800", status: "Pending COD", date: "Yesterday" },
  ]);

  const toggleGatewayStatus = (id: string) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, status: g.status === "Active" ? "Disabled" : "Active" } : g));
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Payments & Gateway Architecture</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage global & local payment processors, API credentials, webhooks, and secure transaction logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            Payment Gateways: 7 Active
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        {[
          { id: "gateways", label: "💳 Gateway Integrations & API Keys" },
          { id: "transactions", label: "📊 Transaction Logs & Payouts" },
          { id: "settings", label: "⚙️ Currency & Tax Rules" },
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

      {/* TAB 1: GATEWAY INTEGRATIONS */}
      {activeTab === "gateways" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gateways.map(gw => (
              <div key={gw.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-gray-900">{gw.name}</h3>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">{gw.type}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Fee Structure: <strong className="text-gray-600">{gw.fee}</strong></p>
                  </div>
                  <button
                    onClick={() => toggleGatewayStatus(gw.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${gw.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {gw.status}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">API Key / Credentials</label>
                  <input
                    type="password"
                    value={gw.apiKey}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button onClick={() => alert(`${gw.name} configuration saved successfully!`)} className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition">
                    Configure Keys ⚙️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTION LOGS */}
      {activeTab === "transactions" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900">Secure Payment Transaction Logs</h3>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-bold text-gray-900">{tx.id}</td>
                    <td className="py-4 px-4 font-mono text-indigo-600">{tx.order}</td>
                    <td className="py-4 px-4 font-semibold">{tx.customer}</td>
                    <td className="py-4 px-4 text-gray-600">{tx.gateway}</td>
                    <td className="py-4 px-4 font-extrabold text-gray-900">{tx.amount}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600">{tx.status}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-400">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Currency & Regional Checkout Rules</h3>
            <p className="text-xs text-gray-500 mt-0.5">Configure default store currency, tax inclusion, and auto-conversion rates.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Default Store Currency</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                <option>PKR (Pakistani Rupee)</option>
                <option>USD (US Dollar)</option>
                <option>GBP (British Pound)</option>
                <option>EUR (Euro)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tax Calculation Rule</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                <option>17% GST (Exclusive of product price)</option>
                <option>17% GST (Inclusive of product price)</option>
                <option>Tax Free / Exempt</option>
              </select>
            </div>

            <button onClick={() => alert("Payment and currency settings updated successfully!")} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition shadow-sm">
              Save Gateway Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}