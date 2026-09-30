"use client";
import { useState } from "react";

export default function SEOPage() {
  const [sitemapStatus, setSitemapStatus] = useState("Generated & Pinged Google Search Console 🟢");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerateSitemap = () => {
    setIsGenerating(true);
    setSitemapStatus("Crawling dynamic product & category routes...");
    setTimeout(() => {
      setIsGenerating(false);
      setSitemapStatus("Success! sitemap.xml updated & Google indexed 48 URLs.");
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">SEO & Metadata Optimization Hub 🔍</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage meta tags, dynamic sitemaps, robots.txt, and search engine indexing performance.</p>
        </div>
        <span className="px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-extrabold flex items-center gap-2 border border-emerald-100">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> GSC Indexing Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Indexed URLs</span>
          <h3 className="text-2xl font-extrabold text-gray-900">48 Pages</h3>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Zero Errors</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Robots.txt Status</span>
          <h3 className="text-2xl font-extrabold text-indigo-600">Optimized</h3>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Allow All Crawlers</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Sitemap Status</span>
          <h3 className="text-2xl font-extrabold text-emerald-600">Active</h3>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Auto-Updates Daily</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Dynamic Sitemap Generator</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            NexaCommerce automatically builds XML sitemaps including products, categories, and blog posts whenever inventory or content updates.
          </p>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase">Sync Result</span>
            <p className="text-xs font-bold text-gray-800">{sitemapStatus}</p>
          </div>
          <button 
            onClick={handleRegenerateSitemap}
            disabled={isGenerating}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? "Rebuilding Sitemap..." : "Regenerate & Ping Google 🚀"}
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Global OpenGraph & Meta Defaults</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Default Meta Title Template</label>
              <input type="text" readOnly value="%s | NexaCommerce Enterprise Store" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-600" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Default Meta Description</label>
              <textarea readOnly rows={2} value="Shop premium aesthetic wear, digital kits, and enterprise developer tools with high-speed delivery." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}