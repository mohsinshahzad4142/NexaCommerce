"use client";
import { useState } from "react";

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState<"sales" | "products" | "customers" | "traffic">("sales");
  const [timeframe, setTimeframe] = useState<"today" | "weekly" | "monthly" | "yearly">("monthly");

  // Mock analytics data with chart bars
  const salesData = {
    today: { sales: "Rs. 45,200", orders: "14 Orders", aov: "Rs. 3,228", revenue: "Rs. 45,200", refunds: "Rs. 1,200", chartBars: [20, 35, 50, 30, 70, 85, 60] },
    weekly: { sales: "Rs. 342,000", orders: "98 Orders", aov: "Rs. 3,489", revenue: "Rs. 342,000", refunds: "Rs. 4,500", chartBars: [50, 70, 65, 90, 85, 100, 95] },
    monthly: { sales: "Rs. 4,250,000", orders: "1,142 Orders", aov: "Rs. 3,721", revenue: "Rs. 4,250,000", refunds: "Rs. 32,400", chartBars: [60, 80, 75, 90, 110, 125, 140] },
    yearly: { sales: "Rs. 48,900,000", orders: "14,280 Orders", aov: "Rs. 3,424", revenue: "Rs. 48,900,000", refunds: "Rs. 412,000", chartBars: [40, 60, 80, 100, 130, 160, 190] },
  };

  const currentSales = salesData[timeframe];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header & GA4 Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Enterprise Analytics & GA4 Hub 📊</h1>
          <p className="text-xs text-gray-500 mt-0.5">Comprehensive business intelligence, sales velocity, product performance, and visitor traffic.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> GA4 Stream Active (G-NEX2026)
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm text-xs font-bold">
        {[
          { id: "sales", label: "Sales & Revenue 💰" },
          { id: "products", label: "Product Performance 🛍️" },
          { id: "customers", label: "Customer Insights 👥" },
          { id: "traffic", label: "Traffic & GA4 📈" },
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

      {/* 1. SALES & REVENUE TAB */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">Select Sales Timeframe</h3>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
              {(["today", "weekly", "monthly", "yearly"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3.5 py-1.5 rounded-lg capitalize transition ${timeframe === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase">Sales ({timeframe})</span>
              <h3 className="text-xl font-extrabold text-gray-900">{currentSales.sales}</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified 🟢</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase">Total Orders</span>
              <h3 className="text-xl font-extrabold text-gray-900">{currentSales.orders}</h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Fulfilled</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase">Avg Order Value (AOV)</span>
              <h3 className="text-xl font-extrabold text-gray-900">{currentSales.aov}</h3>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Optimal</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase">Gross Revenue</span>
              <h3 className="text-xl font-extrabold text-gray-900">{currentSales.revenue}</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+18.4% vs last</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase">Refunds & Returns</span>
              <h3 className="text-xl font-extrabold text-rose-600">{currentSales.refunds}</h3>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Low rate</span>
            </div>
          </div>

          {/* Interactive Sales & Revenue Chart Rendering Engine */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Interactive Sales & Revenue Chart Rendering Engine</h3>
                <p className="text-xs text-gray-500">Visualizing performance metrics across selected {timeframe} timeline.</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">Live Sync 🟢</span>
            </div>

            {/* Visual Bar Graph Representation */}
            <div className="h-64 flex items-end justify-between gap-4 pt-10 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              {currentSales.chartBars.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition">Rs. {val * 1250}</span>
                  <div 
                    style={{ height: `${val}%` }} 
                    className="w-full bg-indigo-600 rounded-t-2xl transition-all duration-500 group-hover:bg-indigo-700 shadow-sm"
                  ></div>
                  <span className="text-[11px] font-extrabold text-gray-500">T-{7 - idx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCT PERFORMANCE TAB */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">🔥 Best-Selling Products</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: "Nexa Oversized Aesthetic Hoodie", sales: "420 units", rev: "Rs. 1,680,000" },
                { name: "Python FastAPI Backend Starter Kit", sales: "285 units", rev: "Rs. 1,425,000" },
                { name: "Minimalist Ergonomic Desk Mat", sales: "190 units", rev: "Rs. 475,000" },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <strong className="text-gray-900 block">{p.name}</strong>
                    <span className="text-[11px] text-gray-500">{p.sales} sold</span>
                  </div>
                  <span className="font-extrabold text-indigo-600">{p.rev}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">📉 Low-Selling & Out-of-Stock</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: "Vintage Leather Wallet", status: "Low-Selling", count: "3 units left" },
                { name: "Classic Cotton Polo (White)", status: "Out-of-Stock", count: "0 units" },
                { name: "Wireless Mechanical Keyboard", status: "Low-Selling", count: "2 units left" },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <strong className="text-gray-900 block">{p.name}</strong>
                    <span className="text-[11px] text-gray-500">{p.count}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${p.status === 'Out-of-Stock' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOMER INSIGHTS TAB */}
      {activeTab === "customers" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase">New Customers</span>
            <h3 className="text-2xl font-extrabold text-gray-900">348 Users</h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">+24% this month</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase">Returning Customers</span>
            <h3 className="text-2xl font-extrabold text-gray-900">794 Users</h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">High Loyalty</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase">Customer Retention Rate</span>
            <h3 className="text-2xl font-extrabold text-gray-900">68.4%</h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Above Industry Avg</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase">Customer Lifetime Value (CLV)</span>
            <h3 className="text-2xl font-extrabold text-gray-900">Rs. 18,450</h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Target: Rs. 20k</span>
          </div>
        </div>
      )}

      {/* 4. TRAFFIC & GA4 INTEGRATION TAB */}
      {activeTab === "traffic" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Total Visitors</span>
              <h3 className="text-2xl font-extrabold text-gray-900">45,820</h3>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Unique IPs Tracked</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Total Sessions</span>
              <h3 className="text-2xl font-extrabold text-gray-900">62,100</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Avg Duration: 3m 42s</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Conversion Rate</span>
              <h3 className="text-2xl font-extrabold text-gray-900">3.85%</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Checkout Success</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900">🌐 Top Traffic Sources (GA4)</h3>
              <div className="space-y-3 text-xs">
                {[
                  { source: "Google Organic Search", percent: "48.2%", visitors: "22,090" },
                  { source: "Direct & Bookmark", percent: "24.5%", visitors: "11,220" },
                  { source: "Instagram / Social Media", percent: "18.1%", visitors: "8,300" },
                  { source: "Email Campaigns & SMS", percent: "9.2%", visitors: "4,210" },
                ].map((t, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <strong className="text-gray-900 block">{t.source}</strong>
                      <span className="text-[11px] text-gray-500">{t.visitors} visitors</span>
                    </div>
                    <span className="font-extrabold text-indigo-600">{t.percent}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900">📱 Device Analytics Breakdown</h3>
              <div className="space-y-3 text-xs">
                {[
                  { device: "Mobile Smartphones (Android / iOS)", percent: "72.4%", status: "Primary" },
                  { device: "Desktop Computers & Laptops", percent: "23.1%", status: "High AOV" },
                  { device: "Tablet Devices", percent: "4.5%", status: "Standard" },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <strong className="text-gray-900 block">{d.device}</strong>
                      <span className="text-[11px] text-gray-500">{d.status}</span>
                    </div>
                    <span className="font-extrabold text-indigo-600">{d.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}