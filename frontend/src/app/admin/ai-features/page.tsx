"use client";
import { useState } from "react";

export default function AIFeaturesPage() {
  const [aiLayerEnabled, setAiLayerEnabled] = useState(true);
  const [generatingStatus, setGeneratingStatus] = useState<string | null>(null);

  const handleTestAI = (featureName: string) => {
    setGeneratingStatus(`Processing ${featureName} via AI Engine...`);
    setTimeout(() => {
      setGeneratingStatus(`Successfully generated output for ${featureName}! 🟢`);
    }, 1200);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header & Master AI Switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">AI Features & Smart Layer 🤖</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage intelligent automation, generation tools, and optional AI microservices.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
          <span className="text-xs font-bold text-gray-700">Optional AI Service Layer:</span>
          <button 
            onClick={() => setAiLayerEnabled(!aiLayerEnabled)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${aiLayerEnabled ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-200 text-gray-600'}`}
          >
            {aiLayerEnabled ? "Active 🟢" : "Bypassed / Offline ⚪"}
          </button>
        </div>
      </div>

      {generatingStatus && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-700 flex justify-between items-center animate-fadeIn">
          <span>{generatingStatus}</span>
          <button onClick={() => setGeneratingStatus(null)} className="text-indigo-400 hover:text-indigo-600 font-extrabold">✕</button>
        </div>
      )}

      {!aiLayerEnabled && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800">
          ⚠️ Notice: AI Layer is currently bypassed. Core store catalog, checkout, and inventory are running normally without AI dependency.
        </div>
      )}

      {/* Grid of AI Capabilities */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!aiLayerEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* 1. Description Generator */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Content Generation</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Product Description Generator</h3>
            <p className="text-xs text-gray-500">Auto-craft high-converting, SEO-optimized product copy tailored for aesthetic and tech items.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Product Description")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Test Description AI ✨
          </button>
        </div>

        {/* 2. AI Product Tags */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Metadata</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Product Tags & Categories</h3>
            <p className="text-xs text-gray-500">Automatically assign clean semantic tags and attributes based on item titles and images.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Product Tags")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Generate Tags 🏷️
          </button>
        </div>

        {/* 3. Image Background Removal / Studio */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Visual Studio</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Image Background Removal</h3>
            <p className="text-xs text-gray-500">Instantly isolate product shots, remove clutter, and generate clean studio-grade white backgrounds.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Background Removal")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Process Image 🖼️
          </button>
        </div>

        {/* 4. AI SEO Title & Meta */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Search Engine Optimization</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI SEO Title & Meta Description</h3>
            <p className="text-xs text-gray-500">Generate high-CTR meta titles and keyword-rich descriptions optimized for Google rankings.</p>
          </div>
          <button 
            onClick={() => handleTestAI("SEO Metadata")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Optimize SEO 🔍
          </button>
        </div>

        {/* 5. AI Product Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Personalization</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Product Recommendations</h3>
            <p className="text-xs text-gray-500">Real-time collaborative filtering and cross-sell engine driven by user browsing session history.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Recommendations Engine")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Sync Recommendations ⚡
          </button>
        </div>

        {/* 6. AI Customer Chatbot */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Support Automation</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Customer Chatbot</h3>
            <p className="text-xs text-gray-500">Instant 24/7 support agent trained on store policies, tracking orders, and product catalogs.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Customer Chatbot")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Configure Chatbot 💬
          </button>
        </div>

        {/* 7. AI Shopping Assistant */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Conversion Tool</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Shopping Assistant</h3>
            <p className="text-xs text-gray-500">Guided quiz-based virtual buyer assistant helping customers find their exact ideal product.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Shopping Assistant")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Test Assistant 🛍️
          </button>
        </div>

        {/* 8. AI Review Summarization */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Social Proof</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Review Summarization</h3>
            <p className="text-xs text-gray-500">Instantly condense hundreds of customer reviews into quick bullet points of pros and cons.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Review Summarization")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Summarize Reviews ⭐
          </button>
        </div>

        {/* 9. AI Sales Insights & Demand Forecasting */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">Business Analytics</span>
            <h3 className="text-sm font-extrabold text-gray-900">AI Sales Insights & Forecasting</h3>
            <p className="text-xs text-gray-500">Predict future stock depletion rates, revenue anomalies, and peak seasonal buying trends.</p>
          </div>
          <button 
            onClick={() => handleTestAI("Sales Forecasting")}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Run Forecasting 📈
          </button>
        </div>

      </div>
    </div>
  );
}