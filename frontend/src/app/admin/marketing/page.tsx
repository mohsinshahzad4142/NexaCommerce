"use client";
import { useState } from "react";

export default function MarketingManagementPage() {
  const [activeTab, setActiveTab] = useState("campaigns");

  // State for campaigns & flash sales
  const [campaigns, setCampaigns] = useState([
    { id: "CMP-01", name: "Summer Mega Flash Sale", type: "Flash Sale", discount: "Up to 50% OFF", status: "Active", reach: "14,200 users" },
    { id: "CMP-02", name: "Eid Discount Campaign", type: "Discount Campaign", discount: "Flat 20% OFF", status: "Scheduled", reach: "8,500 users" },
    { id: "CMP-03", name: "VIP Customer Loyalty Bonus", type: "Customer Segmentation", discount: "Double Points", status: "Active", reach: "1,200 users" },
  ]);

  // Modal & Form State for New Campaign
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCmpName, setNewCmpName] = useState("");
  const [newCmpType, setNewCmpType] = useState("Flash Sale");
  const [newCmpDiscount, setNewCmpDiscount] = useState("");

  // Interactive Management Modal State for Campaigns
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Interactive Configuration Modal State for Automations
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);

  // Interactive Program Modal State for Rewards
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmpName.trim() || !newCmpDiscount.trim()) {
      alert("Please enter campaign name and discount value!");
      return;
    }
    const newEntry = {
      id: `CMP-0${campaigns.length + 1}`,
      name: newCmpName,
      type: newCmpType,
      discount: newCmpDiscount,
      status: "Active",
      reach: "1,000 users",
    };
    setCampaigns([newEntry, ...campaigns]);
    setNewCmpName("");
    setNewCmpDiscount("");
    setShowCampaignModal(false);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    setSelectedCampaign(null);
    alert("Campaign deleted successfully!");
  };

  // State for Omnichannel Automations
  const [automations, setAutomations] = useState([
    { id: "aut-1", channel: "Email Marketing (SMTP / Klaviyo)", status: "Active", trigger: "Welcome series & Newsletters", conversion: "14.2%" },
    { id: "aut-2", channel: "SMS Marketing Gateway", status: "Active", trigger: "Order dispatch & Tracking alerts", conversion: "28.5%" },
    { id: "aut-3", channel: "WhatsApp Notifications API", status: "Active", trigger: "Instant order confirmation & COD verify", conversion: "42.1%" },
    { id: "aut-4", channel: "Web Push Notifications", status: "Paused", trigger: "Price drop & Stock alerts", conversion: "4.8%" },
    { id: "aut-5", channel: "Abandoned Cart Recovery", status: "Active", trigger: "Automated reminder after 2 hours", conversion: "19.3%" },
  ]);

  // State for Growth & Rewards
  const [rewards, setRewards] = useState([
    { name: "Referral Program", detail: "Give $10, Get $10", activeUsers: "432 referrers", status: "Active" },
    { name: "Loyalty Points Engine", detail: "1 Point per Rs. 100 spent", activeUsers: "2,840 members", status: "Active" },
    { name: "Digital Gift Cards", detail: "Custom denominations ($10 - $200)", activeUsers: "94 issued", status: "Active" },
    { name: "Affiliate Partner System", detail: "10% commission per referral link", activeUsers: "58 affiliates", status: "Active" },
  ]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Marketing & Growth Hub</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage campaigns, flash sales, omnichannel notifications, loyalty, referrals, and customer segmentation.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            Growth Engines: Fully Operational
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        {[
          { id: "campaigns", label: "🚀 Campaigns & Flash Sales" },
          { id: "automations", label: "📨 Omnichannel & Abandoned Cart" },
          { id: "rewards", label: "💎 Referral, Loyalty & Affiliates" },
          { id: "segmentation", label: "🎯 Customer Segmentation" },
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

      {/* TAB 1: CAMPAIGNS & FLASH SALES */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Active Discount Campaigns & Flash Sales</h3>
              <p className="text-xs text-gray-500">Run timed countdown promotions and store-wide sales events.</p>
            </div>
            <button 
              onClick={() => setShowCampaignModal(!showCampaignModal)} 
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition shadow-sm"
            >
              {showCampaignModal ? "Cancel" : "+ Launch New Campaign"}
            </button>
          </div>

          {/* Interactive Modal Form for New Campaign */}
          {showCampaignModal && (
            <form onSubmit={handleCreateCampaign} className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-md space-y-4">
              <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">Create New Campaign / Flash Sale</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Campaign Name</label>
                  <input 
                    type="text" 
                    value={newCmpName} 
                    onChange={(e) => setNewCmpName(e.target.value)} 
                    placeholder="e.g. Winter Clearance Sale" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Campaign Type</label>
                  <select 
                    value={newCmpType} 
                    onChange={(e) => setNewCmpType(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="Flash Sale">Flash Sale</option>
                    <option value="Discount Campaign">Discount Campaign</option>
                    <option value="Customer Segmentation">Customer Segmentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Discount Offer</label>
                  <input 
                    type="text" 
                    value={newCmpDiscount} 
                    onChange={(e) => setNewCmpDiscount(e.target.value)} 
                    placeholder="e.g. Up to 40% OFF" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition">
                  Publish Campaign 🚀
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">{c.type}</span>
                    <h4 className="text-sm font-extrabold text-gray-900 mt-1">{c.name}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {c.status}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Offer: <strong className="text-indigo-600">{c.discount}</strong></span>
                  <span className="text-gray-400">Reach: {c.reach}</span>
                </div>
                <button 
                  onClick={() => setSelectedCampaign(c)} 
                  className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition"
                >
                  Manage Campaign ⚙️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OMNICHANNEL & ABANDONED CART */}
      {activeTab === "automations" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Omnichannel Notifications & Abandoned Cart Recovery</h3>
            <p className="text-xs text-gray-500">Automate customer messaging across Email, SMS, WhatsApp, Web Push, and recovery sequences.</p>
          </div>

          <div className="space-y-3">
            {automations.map(aut => (
              <div key={aut.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-gray-900 text-xs">{aut.channel}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${aut.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                      {aut.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Trigger: {aut.trigger}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-indigo-600">Conversion: {aut.conversion}</span>
                  <button 
                    onClick={() => setSelectedAutomation(aut)} 
                    className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 font-bold rounded-xl text-xs transition"
                  >
                    Configure ⚙️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REWARDS, REFERRALS & AFFILIATES */}
      {activeTab === "rewards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((rew, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">{rew.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">{rew.detail}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-full">
                  {rew.status}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 flex justify-between">
                <span>Active Participants:</span>
                <strong className="text-gray-900">{rew.activeUsers}</strong>
              </div>
              <button 
                onClick={() => setSelectedReward(rew)} 
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition"
              >
                Manage Program ⚙️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CUSTOMER SEGMENTATION */}
      {activeTab === "segmentation" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Advanced Customer Segmentation Rules</h3>
            <p className="text-xs text-gray-500">Group customers by purchase history, browsing behavior, and lifetime value for targeted marketing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">VIP Segment</span>
              <h4 className="font-extrabold text-gray-900 text-sm">High Spenders (&gt;$500)</h4>
              <p className="text-xs text-gray-500">1,240 customers eligible for priority support & exclusive flash sales.</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">At-Risk Segment</span>
              <h4 className="font-extrabold text-gray-900 text-sm">Inactive (&gt;60 Days)</h4>
              <p className="text-xs text-gray-500">3,100 customers targeted with automated win-back discount emails.</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">New Leads</span>
              <h4 className="font-extrabold text-gray-900 text-sm">First-Time Visitors</h4>
              <p className="text-xs text-gray-500">5,890 subscribers receiving welcome series & first-order coupon code.</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: MANAGE CAMPAIGN ================= */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">Manage Campaign: {selectedCampaign.name}</h3>
              <button onClick={() => setSelectedCampaign(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Campaign ID & Type</label>
                <p className="p-2.5 bg-gray-50 rounded-xl font-mono text-gray-800">{selectedCampaign.id} ({selectedCampaign.type})</p>
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Discount Offer</label>
                <input 
                  type="text" 
                  defaultValue={selectedCampaign.discount} 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold" 
                />
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Status</label>
                <select defaultValue={selectedCampaign.status} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <button 
                onClick={() => handleDeleteCampaign(selectedCampaign.id)} 
                className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs transition"
              >
                Delete Campaign 🗑️
              </button>
              <button 
                onClick={() => { alert("Campaign settings updated successfully!"); setSelectedCampaign(null); }} 
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                Save Changes ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CONFIGURE AUTOMATION ================= */}
      {selectedAutomation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">Configure Channel: {selectedAutomation.channel}</h3>
              <button onClick={() => setSelectedAutomation(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">API Provider & Credentials</label>
                <input type="text" placeholder="Enter API Key / SMTP Secret" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Automation Trigger Rule</label>
                <input type="text" defaultValue={selectedAutomation.trigger} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Gateway Status</label>
                <select defaultValue={selectedAutomation.status} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => { alert("Automation channel configured successfully!"); setSelectedAutomation(null); }} 
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                Save Configuration ⚙️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: MANAGE PROGRAM ================= */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">Manage Program: {selectedReward.name}</h3>
              <button onClick={() => setSelectedReward(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Reward Structure & Details</label>
                <input type="text" defaultValue={selectedReward.detail} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Program Status</label>
                <select defaultValue={selectedReward.status} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => { alert("Program settings updated successfully!"); setSelectedReward(null); }} 
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                Update Program 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}