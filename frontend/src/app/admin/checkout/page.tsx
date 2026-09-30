"use client";
import { useState } from "react";

export default function CheckoutManagementPage() {
  const [activeTab, setActiveTab] = useState("gateways");

  // Payment Gateways Architecture State
  const [gateways, setGateways] = useState([
    { id: "cod", name: "Cash on Delivery (COD)", type: "Offline", enabled: true, fee: "Rs. 0" },
    { id: "jazzcash", name: "Local Gateways (JazzCash / EasyPaisa)", type: "Local API", enabled: true, fee: "1.5%" },
    { id: "stripe", name: "Stripe Credit/Debit Cards", type: "Global API", enabled: true, fee: "2.9% + $0.30" },
    { id: "paypal", name: "PayPal Checkout", type: "Global API", enabled: true, fee: "3.4% + Fixed" },
    { id: "applepay", name: "Apple Pay & Google Pay", type: "Express Wallet", enabled: true, fee: "Standard" },
    { id: "banktransfer", name: "Direct Bank Transfer (IBFT)", type: "Manual Verification", enabled: true, fee: "Rs. 0" },
    { id: "wallet", name: "NexaCommerce Store Wallet", type: "Internal Credit", enabled: true, fee: "0%" },
  ]);

  // Checkout Configuration Settings
  const [settings, setSettings] = useState({
    guestCheckout: true,
    accountCheckout: true,
    multipleAddresses: true,
    taxEnabled: true,
    taxRate: "17% GST",
    couponSystem: true,
    emailNotifications: true,
    whatsappSmsAlerts: true,
  });

  const toggleGateway = (id: string) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Checkout & Payment Gateway Architecture</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage modular checkout rules, multi-gateway integration (Stripe, PayPal, Local, COD, Wallet), and automated notifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            21/21 Checkout Features Active
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        {[
          { id: "gateways", label: "💳 Payment Gateway Architecture" },
          { id: "rules", label: "🛍️ Checkout Rules & Addresses" },
          { id: "notifications", label: "📩 Confirmations & Notifications" },
          { id: "simulator", label: "🧪 Checkout Flow Simulator" },
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

      {/* TAB 1: PAYMENT GATEWAY ARCHITECTURE */}
      {activeTab === "gateways" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Modular Payment Gateway Integration</h3>
            <p className="text-xs text-gray-500">Enable or disable payment processors instantly. Architecture supports secure tokenization and sandbox/live API switching.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {gateways.map(gw => (
                <div key={gw.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-gray-900 text-xs">{gw.name}</h4>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">{gw.type}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">Processing Fee: <strong className="text-gray-600">{gw.fee}</strong></p>
                  </div>
                  <button
                    onClick={() => toggleGateway(gw.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${gw.enabled ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {gw.enabled ? 'Active ✅' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHECKOUT RULES & ADDRESSES */}
      {activeTab === "rules" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Checkout Flow Configuration</h3>
            <p className="text-xs text-gray-500 mt-0.5">Customize customer checkout behavior, tax rates, and address handling.</p>
          </div>

          <div className="space-y-4">
            {[
              { key: "guestCheckout", label: "Allow Guest Checkout (No account required)", desc: "Enables fast checkout without forcing user registration." },
              { key: "accountCheckout", label: "Registered Account Checkout", desc: "Allows logged-in users to save order history and loyalty points." },
              { key: "multipleAddresses", label: "Multiple Saved Addresses per Customer", desc: "Let users save different shipping & billing addresses." },
              { key: "taxEnabled", label: "Automated Tax Calculation (17% GST)", desc: "Calculates regional tax based on shipping destination." },
              { key: "couponSystem", label: "Discount Coupons & Promo Codes", desc: "Enables promo code box during checkout calculation." },
            ].map(item => (
              <div key={item.key} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-900 text-xs">{item.label}</h4>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(settings as any)[item.key]}
                  onChange={() => setSettings({ ...settings, [item.key]: !(settings as any)[item.key] })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONFIRMATIONS & NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Email Confirmation & Invoices</h3>
            <p className="text-xs text-gray-500">Automated HTML email receipts sent via SMTP / SendGrid upon successful order placement.</p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">SMTP Status: Connected</span>
              <p className="text-xs text-gray-600">Template: <strong>NexaCommerce Standard Invoice #INV</strong></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">WhatsApp & SMS Order Alerts</h3>
            <p className="text-xs text-gray-500">Instant dispatch updates and order verification via Twilio or local SMS gateway.</p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">API Gateway: Active</span>
              <p className="text-xs text-gray-600">Automated SMS trigger on Order Placed, Dispatched & Delivered.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHECKOUT FLOW SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">End-to-End Checkout Flow Test</h3>
            <p className="text-xs text-gray-500 mt-0.5">Simulate how a customer experiences the cart summary, address selection, and payment method selection.</p>
          </div>

          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-900 border-b border-indigo-100 pb-2">
              <span>Item (Ultra Wireless Headphones x 1)</span>
              <span>Rs. 4,500</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Shipping (Punjab Zone Flat)</span>
              <span>Rs. 250</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Estimated Tax (17% GST)</span>
              <span>Rs. 765</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-indigo-100">
              <span>Total Payable</span>
              <span className="text-indigo-600">Rs. 5,515</span>
            </div>
          </div>

          <button onClick={() => alert("Simulated Order Created Successfully! Email & WhatsApp notification triggered.")} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition shadow-sm">
            Simulate Place Order Now 🚀
          </button>
        </div>
      )}
    </div>
  );
}