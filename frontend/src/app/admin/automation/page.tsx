"use client";
import { useState } from "react";

interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  condition: string;
  action: string;
  status: boolean;
  executions: number;
  lastRun: string;
}

interface ExecutionLog {
  id: string;
  ruleTitle: string;
  eventDetails: string;
  timestamp: string;
  status: "Success" | "Failed";
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<"rules" | "logs" | "builder">("rules");

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "rule-1",
      title: "Low Stock Alert to Admin",
      trigger: "Inventory Updated",
      condition: "Stock Quantity < 5",
      action: "Send Push Notification & Email to Admin",
      status: true,
      executions: 142,
      lastRun: "10 mins ago"
    },
    {
      id: "rule-2",
      title: "Abandoned Cart Recovery",
      trigger: "Cart Inactive",
      condition: "Time Elapsed > 2 Hours",
      action: "Send Discount Email (10% Off) to Customer",
      status: true,
      executions: 589,
      lastRun: "2 mins ago"
    },
    {
      id: "rule-3",
      title: "Automated Review Request",
      trigger: "Order Status Changed",
      condition: "Status == 'Delivered'",
      action: "Send Review Request SMS/Email with Feedback Link",
      status: true,
      executions: 1240,
      lastRun: "1 hour ago"
    },
    {
      id: "rule-4",
      title: "VIP Customer Tagging",
      trigger: "Customer Order Placed",
      condition: "Lifetime Spend > $500",
      action: "Assign 'VIP Customer' Tag & Grant Free Shipping",
      status: false,
      executions: 84,
      lastRun: "Yesterday"
    }
  ]);

  const [logs, setLogs] = useState<ExecutionLog[]>([
    { id: "log-1", ruleTitle: "Abandoned Cart Recovery", eventDetails: "Cart #C-9021 abandoned by john@example.com", timestamp: "2026-09-27 13:40", status: "Success" },
    { id: "log-2", ruleTitle: "Low Stock Alert to Admin", eventDetails: "Product 'Aesthetic Hoodie Black' stock reached 3 units", timestamp: "2026-09-27 13:30", status: "Success" },
    { id: "log-3", ruleTitle: "Automated Review Request", eventDetails: "Order #ORD-8821 marked as Delivered for Sarah Connor", timestamp: "2026-09-27 12:15", status: "Success" },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  // New Rule Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTrigger, setNewTrigger] = useState("Inventory Updated");
  const [newCondition, setNewCondition] = useState("");
  const [newAction, setNewAction] = useState("");

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: !r.status } : r));
    setNotification("Automation rule status updated successfully! ⚡");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCondition || !newAction) return;

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      title: newTitle,
      trigger: newTrigger,
      condition: newCondition,
      action: newAction,
      status: true,
      executions: 0,
      lastRun: "Just now"
    };

    setRules([newRule, ...rules]);
    setNotification(`New event automation "${newTitle}" deployed successfully! 🚀`);
    setNewTitle("");
    setNewCondition("");
    setNewAction("");
    setActiveTab("rules");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Event-Driven Automation Hub 🔄</h1>
          <p className="text-xs text-gray-500 mt-0.5">Automate store operations with real-time triggers, smart conditions, and automated actions.</p>
        </div>
        <button 
          onClick={() => setActiveTab("builder")}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
        >
          + Create Custom Workflow
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "rules" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          ⚡ Active Workflows ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "logs" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          📜 Execution Logs ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab("builder")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "builder" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🛠️ Visual Workflow Builder
        </button>
      </div>

      {/* TAB 1: RULES LIST */}
      {activeTab === "rules" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">
                      Trigger: {rule.trigger}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 mt-2">{rule.title}</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rule.status} 
                      onChange={() => toggleRuleStatus(rule.id)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1 text-xs">
                  <div className="text-gray-500 font-bold">Condition: <span className="text-gray-800 font-extrabold">{rule.condition}</span></div>
                  <div className="text-gray-500 font-bold">Action: <span className="text-indigo-600 font-extrabold">{rule.action}</span></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                <span>Executed: <strong className="text-gray-900">{rule.executions} times</strong></span>
                <span>Last run: {rule.lastRun}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EXECUTION LOGS */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900">Real-time Automation Execution History</h3>
            <p className="text-xs text-gray-500">Track every event triggered across your store infrastructure.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <th className="p-4">Workflow Name</th>
                  <th className="p-4">Event Details</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-extrabold text-indigo-600">{log.ruleTitle}</td>
                    <td className="p-4 text-gray-900">{log.eventDetails}</td>
                    <td className="p-4 text-gray-500 font-mono">{log.timestamp}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-700">
                        {log.status} 🟢
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VISUAL WORKFLOW BUILDER */}
      {activeTab === "builder" && (
        <div className="bg-white max-w-3xl mx-auto rounded-3xl border border-gray-200 shadow-sm p-8 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-extrabold text-gray-900">Create Custom Automation Rule</h3>
            <p className="text-xs text-gray-500">Configure event triggers, conditions, and automated actions easily.</p>
          </div>

          <form onSubmit={handleCreateRule} className="space-y-6 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-gray-700">Workflow Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. High Value Customer Discount Reward" 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-bold text-gray-700">When Event Occurs (Trigger)</label>
                <select 
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600 cursor-pointer"
                >
                  <option value="Inventory Updated">Inventory Quantity Updated</option>
                  <option value="Cart Inactive">Cart Abandoned (Time Elapsed)</option>
                  <option value="Order Status Changed">Order Status Changed</option>
                  <option value="Customer Order Placed">Customer Order Placed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-gray-700">If Condition Matches</label>
                <input 
                  type="text" 
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Order Total > $500" 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-700">Then Execute Action</label>
              <input 
                type="text" 
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g. Send VIP SMS and Apply 20% Lifetime Discount Badge" 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => setActiveTab("rules")}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                Deploy Workflow 🚀
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}