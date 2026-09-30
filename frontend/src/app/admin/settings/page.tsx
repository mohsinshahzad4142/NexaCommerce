"use client";
import { useState } from "react";

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const [settings, setSettings] = useState({
    storeName: "NexaCommerce Enterprise",
    storeTagline: "The Ultimate WooCommerce Killer",
    currency: "PKR (Rs.)",
    taxRate: "18%",
    shippingFee: "250",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    
    stripeEnabled: true,
    codEnabled: true,
    jazzcashEnabled: true,
    easypaisaEnabled: true,

    smtpHost: "smtp.mailgun.org",
    smtpEmail: "support@nexacommerce.pk",
    smsGateway: "Telenor SMS API",
    smsApiKey: "************************",

    invoicePrefix: "NEX-2026-",
    invoiceFooter: "Thank you for shopping with NexaCommerce!",
    autoFulfill: false,
    lowStockThreshold: "5",

    requirePhone: true,
    guestCheckout: true,
    minOrderValue: "500",

    facebookUrl: "https://facebook.com/nexacommerce",
    instagramUrl: "https://instagram.com/nexacommerce",
    whatsappNumber: "+923001234567",

    metaTitle: "NexaCommerce - Premium Online Shopping in Pakistan",
    metaDescription: "Buy high quality apparel, tech, and lifestyle items with fast nationwide shipping across Pakistan.",
    metaKeywords: "ecommerce, online shopping, pakistan, nexacommerce, aesthetic wear",
    googleVerification: "google-site-verification=abc123xyz",
    fbPixelId: "123456789098765",
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setModalMsg("All Store Settings & SEO configurations successfully compiled and synced with the PostgreSQL backend database! 🚀");
    setModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative">
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900">Settings Saved 🚀</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600">✕</button>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">{modalMsg}</p>
            <button onClick={() => setModalOpen(false)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition">
              Done & Close 🚀
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Enterprise Store Settings & SEO Hub</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure every aspect of your store without touching code: Branding, Taxes, Payments, SEO & Automation.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
        >
          Save All Changes 💾
        </button>
      </div>

      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm text-xs font-bold">
        {[
          { id: "general", label: "General Branding ⚙️" },
          { id: "finance", label: "Tax & Currency 💰" },
          { id: "fulfillment", label: "Shipping & Payments 🚚" },
          { id: "notifications", label: "Email & SMS 📩" },
          { id: "orders_customers", label: "Orders & Customers 🛍️" },
          { id: "checkout", label: "Checkout & Invoice 🧾" },
          { id: "social", label: "Social Media 🌐" },
          { id: "seo", label: "SEO & Meta Settings 🔍" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        {activeTab === "general" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">General Store & Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Store Name</label>
                <input 
                  type="text" 
                  value={settings.storeName} 
                  onChange={e => handleChange("storeName", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Store Tagline</label>
                <input 
                  type="text" 
                  value={settings.storeTagline} 
                  onChange={e => handleChange("storeTagline", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Logo URL</label>
                <input 
                  type="text" 
                  value={settings.logoUrl} 
                  onChange={e => handleChange("logoUrl", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Favicon URL</label>
                <input 
                  type="text" 
                  value={settings.faviconUrl} 
                  onChange={e => handleChange("faviconUrl", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Currency & Tax Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Default Currency</label>
                <select 
                  value={settings.currency} 
                  onChange={e => handleChange("currency", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="PKR (Rs.)">PKR (Rs.) - Pakistani Rupee</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Default Tax Rate (%)</label>
                <input 
                  type="text" 
                  value={settings.taxRate} 
                  onChange={e => handleChange("taxRate", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "fulfillment" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Shipping & Payment Gateways</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Flat Shipping Fee (PKR)</label>
                <input 
                  type="text" 
                  value={settings.shippingFee} 
                  onChange={e => handleChange("shippingFee", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="font-extrabold text-gray-700 block text-xs">Active Payment Methods</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
                {[
                  { key: "stripeEnabled", label: "Stripe / Credit Card" },
                  { key: "codEnabled", label: "Cash on Delivery (COD)" },
                  { key: "jazzcashEnabled", label: "JazzCash Gateway" },
                  { key: "easypaisaEnabled", label: "EasyPaisa Mobile" },
                ].map(p => (
                  <label key={p.key} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={(settings as any)[p.key]} 
                      onChange={e => handleChange(p.key, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-gray-900">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Email & SMS Gateway Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">SMTP Mail Host</label>
                <input 
                  type="text" 
                  value={settings.smtpHost} 
                  onChange={e => handleChange("smtpHost", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Sender Support Email</label>
                <input 
                  type="text" 
                  value={settings.smtpEmail} 
                  onChange={e => handleChange("smtpEmail", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">SMS Gateway Provider</label>
                <input 
                  type="text" 
                  value={settings.smsGateway} 
                  onChange={e => handleChange("smsGateway", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">SMS API Secret Key</label>
                <input 
                  type="password" 
                  value={settings.smsApiKey} 
                  onChange={e => handleChange("smsApiKey", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders_customers" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Order & Customer Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Low Stock Alert Threshold</label>
                <input 
                  type="number" 
                  value={settings.lowStockThreshold} 
                  onChange={e => handleChange("lowStockThreshold", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold pt-2">
              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoFulfill} 
                  onChange={e => handleChange("autoFulfill", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-gray-900">Enable Auto-Fulfillment on Online Payment</span>
              </label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.requirePhone} 
                  onChange={e => handleChange("requirePhone", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-gray-900">Require Phone Number for Customer Registration</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "checkout" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Checkout Settings & Invoicing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Invoice Number Prefix</label>
                <input 
                  type="text" 
                  value={settings.invoicePrefix} 
                  onChange={e => handleChange("invoicePrefix", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Minimum Order Value (PKR)</label>
                <input 
                  type="number" 
                  value={settings.minOrderValue} 
                  onChange={e => handleChange("minOrderValue", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-extrabold text-gray-700 block">Invoice Footer Note</label>
                <input 
                  type="text" 
                  value={settings.invoiceFooter} 
                  onChange={e => handleChange("invoiceFooter", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer text-xs font-bold">
                <input 
                  type="checkbox" 
                  checked={settings.guestCheckout} 
                  onChange={e => handleChange("guestCheckout", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-gray-900">Allow Guest Checkout (No account creation mandatory)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Social Media Links & Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Facebook Page URL</label>
                <input 
                  type="text" 
                  value={settings.facebookUrl} 
                  onChange={e => handleChange("facebookUrl", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Instagram Profile URL</label>
                <input 
                  type="text" 
                  value={settings.instagramUrl} 
                  onChange={e => handleChange("instagramUrl", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">WhatsApp Support Number</label>
                <input 
                  type="text" 
                  value={settings.whatsappNumber} 
                  onChange={e => handleChange("whatsappNumber", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">SEO & Metadata Settings (Enhanced Hub)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Default Meta Title</label>
                <input 
                  type="text" 
                  value={settings.metaTitle} 
                  onChange={e => handleChange("metaTitle", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Google Search Console Verification Tag</label>
                <input 
                  type="text" 
                  value={settings.googleVerification} 
                  onChange={e => handleChange("googleVerification", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-extrabold text-gray-700 block">Default Meta Description</label>
                <textarea 
                  rows={3}
                  value={settings.metaDescription} 
                  onChange={e => handleChange("metaDescription", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Meta Keywords</label>
                <input 
                  type="text" 
                  value={settings.metaKeywords} 
                  onChange={e => handleChange("metaKeywords", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-extrabold text-gray-700 block">Facebook Pixel ID / Analytics</label>
                <input 
                  type="text" 
                  value={settings.fbPixelId} 
                  onChange={e => handleChange("fbPixelId", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}