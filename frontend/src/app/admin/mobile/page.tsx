"use client";
import { useState } from "react";

interface MobileAppItem {
  id: string;
  appName: string;
  targetAudience: "Customers" | "Store Admins" | "Delivery Riders" | "Vendors";
  technology: string;
  status: "Live on PWA" | "Ready for App Store" | "In Development";
  downloadsOrActive: string;
  description: string;
}

export default function MobileHubPage() {
  const [activePhase, setActivePhase] = useState<"phase1" | "phase2">("phase1");

  const [apps, setApps] = useState<MobileAppItem[]>([
    { id: "m1", appName: "NexaCommerce Storefront PWA", targetAudience: "Customers", technology: "Next.js + Service Workers + Web Manifest", status: "Live on PWA", downloadsOrActive: "45.2k Active Users", description: "Lightning-fast mobile web experience with offline caching, push notifications, and home screen install." },
    { id: "m2", appName: "Nexa Admin Control App", targetAudience: "Store Admins", technology: "React Native (iOS & Android)", status: "Ready for App Store", downloadsOrActive: "12 Admins", description: "Real-time order alerts, sales analytics dashboard, and product inventory management on the go." },
    { id: "m3", appName: "Nexa Delivery Partner App", targetAudience: "Delivery Riders", technology: "React Native + Google Maps API", status: "In Development", downloadsOrActive: "28 Riders Assigned", description: "Live GPS routing, order status updates, digital signature scanning, and cash-on-delivery tracking." },
    { id: "m4", appName: "Nexa Vendor Marketplace App", targetAudience: "Vendors", technology: "React Native Cross-Platform", status: "In Development", downloadsOrActive: "14 Stores", description: "Dedicated dashboard for independent vendors to manage catalog, accept orders, and view payout logs." },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handlePublishAction = (appName: string) => {
    setNotification(`Deployment pipeline triggered for "${appName}"! Building binary artifacts... 🚀`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Mobile & App Ecosystem Hub 📱</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage Progressive Web Apps (PWA) and React Native mobile applications for customers, admins, riders, and vendors.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotification("PWA Service Worker and manifest regenerated successfully! ⚡")}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            Regenerate PWA Manifest 🌐
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Phase Switcher Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActivePhase("phase1")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activePhase === "phase1" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🚀 Phase 1: Responsive Web & PWA
        </button>
        <button
          onClick={() => setActivePhase("phase2")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activePhase === "phase2" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          📱 Phase 2: React Native Apps (iOS & Android)
        </button>
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps
          .filter(app => activePhase === 'phase1' ? app.targetAudience === 'Customers' : app.targetAudience !== 'Customers')
          .map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">
                    {app.targetAudience}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                    app.status === 'Live on PWA' ? 'bg-emerald-50 text-emerald-700' :
                    app.status === 'Ready for App Store' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{app.appName}</h3>
                  <p className="text-xs font-mono font-medium text-indigo-500 mt-0.5">{app.technology}</p>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">{app.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600">{app.downloadsOrActive}</span>
                <button
                  onClick={() => handlePublishAction(app.appName)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  Configure / Build ⚙️
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}