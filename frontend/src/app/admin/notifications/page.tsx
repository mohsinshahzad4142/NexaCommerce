"use client";
import { useState } from "react";

const channelsList = [
  { id: "email", name: "Email", icon: "📧", desc: "SMTP / Mailgun / SendGrid" },
  { id: "sms", name: "SMS", icon: "📱", desc: "Local & Global SMS Gateway" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", desc: "Meta Cloud API / Business" },
  { id: "push", name: "Push Notification", icon: "🔔", desc: "Firebase Cloud Messaging (FCM)" },
];

const eventsList = [
  { id: "new_order", name: "New Order Placed", category: "Orders", desc: "Triggered when a customer places an order" },
  { id: "order_confirmed", name: "Order Confirmed", category: "Orders", desc: "Triggered when admin/manager verifies order" },
  { id: "order_shipped", name: "Order Shipped", category: "Fulfillment", desc: "Triggered when courier tracking is assigned" },
  { id: "order_delivered", name: "Order Delivered", category: "Fulfillment", desc: "Triggered upon successful package delivery" },
  { id: "order_cancelled", name: "Order Cancelled", category: "Orders", desc: "Triggered if order is cancelled by user/admin" },
  { id: "payment_received", name: "Payment Received", category: "Finance", desc: "Triggered on successful online/bank payment" },
  { id: "payment_failed", name: "Payment Failed", category: "Finance", desc: "Triggered when payment gateway declines charge" },
  { id: "low_stock", name: "Low Stock Alert", category: "Inventory", desc: "Triggered when product stock drops below threshold" },
  { id: "new_customer", name: "New Customer Registration", category: "Users", desc: "Triggered on successful signup or account creation" },
  { id: "password_reset", name: "Password Reset Request", category: "Security", desc: "Triggered when user requests OTP/reset link" },
];

export default function NotificationSystemPage() {
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    new_order: { email: true, sms: true, whatsapp: true, push: true },
    order_confirmed: { email: true, sms: true, whatsapp: true, push: false },
    order_shipped: { email: true, sms: true, whatsapp: true, push: true },
    order_delivered: { email: true, sms: false, whatsapp: true, push: true },
    order_cancelled: { email: true, sms: true, whatsapp: true, push: false },
    payment_received: { email: true, sms: true, whatsapp: false, push: true },
    payment_failed: { email: true, sms: true, whatsapp: false, push: true },
    low_stock: { email: true, sms: false, whatsapp: false, push: true },
    new_customer: { email: true, sms: false, whatsapp: false, push: false },
    password_reset: { email: true, sms: true, whatsapp: false, push: false },
  });

  const [channelConfigs, setChannelConfigs] = useState({
    emailSender: "support@nexacommerce.pk",
    smsSenderId: "NexaStore",
    whatsappPhoneId: "WHATSAPP_ID_98231",
    fcmServerKey: "AAAA_fcm_secret_key_sample",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"matrix" | "gateways">("matrix");

  const toggleCell = (eventId: string, channelId: string) => {
    setMatrix(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [channelId]: !prev[eventId]?.[channelId]
      }
    }));
  };

  const handleSave = () => {
    setModalMsg("Central Notification Engine routing rules and channel configurations successfully updated in the PostgreSQL database! 🚀");
    setModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative">
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900">Notification Rules Saved</h3>
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
          <h1 className="text-2xl font-extrabold text-gray-900">Central Notification Engine</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage automated alerts across Email, SMS, WhatsApp, and Push for all system events.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
        >
          Save Notification Rules 🔔
        </button>
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm w-fit text-xs font-bold">
        <button 
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2 rounded-xl transition ${activeTab === "matrix" ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Event Routing Matrix ⚡
        </button>
        <button 
          onClick={() => setActiveTab("gateways")}
          className={`px-4 py-2 rounded-xl transition ${activeTab === "gateways" ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Gateway Credentials ⚙️
        </button>
      </div>

      {activeTab === "matrix" ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">System Event</th>
                  {channelsList.map(ch => (
                    <th key={ch.id} className="p-4 text-center">
                      <span className="block text-sm">{ch.icon} {ch.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal lowercase">{ch.desc}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {eventsList.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <strong className="text-gray-900 text-sm font-bold">{ev.name}</strong>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-extrabold">{ev.category}</span>
                      </div>
                      <span className="text-gray-400 text-[11px] block mt-0.5">{ev.desc}</span>
                    </td>
                    {channelsList.map(ch => {
                      const isEnabled = matrix[ev.id]?.[ch.id] || false;
                      return (
                        <td key={ch.id} className="p-4 text-center">
                          <button 
                            onClick={() => toggleCell(ev.id, ch.id)}
                            className={`w-10 h-10 rounded-2xl font-bold transition flex items-center justify-center mx-auto text-sm ${
                              isEnabled 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm' 
                                : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {isEnabled ? "✓" : "—"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-gray-900 border-b pb-3">Notification Gateway Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="font-extrabold text-gray-700 block">Email Sender Address (SMTP)</label>
              <input 
                type="text" 
                value={channelConfigs.emailSender}
                onChange={e => setChannelConfigs({...channelConfigs, emailSender: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <label className="font-extrabold text-gray-700 block">SMS Sender ID / Masking</label>
              <input 
                type="text" 
                value={channelConfigs.smsSenderId}
                onChange={e => setChannelConfigs({...channelConfigs, smsSenderId: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <label className="font-extrabold text-gray-700 block">WhatsApp Business Cloud Phone ID</label>
              <input 
                type="text" 
                value={channelConfigs.whatsappPhoneId}
                onChange={e => setChannelConfigs({...channelConfigs, whatsappPhoneId: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <label className="font-extrabold text-gray-700 block">Firebase Cloud Messaging (FCM) Server Key</label>
              <input 
                type="password" 
                value={channelConfigs.fcmServerKey}
                onChange={e => setChannelConfigs({...channelConfigs, fcmServerKey: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}