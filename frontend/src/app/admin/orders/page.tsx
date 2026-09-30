"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type OrderStatus = 
  | "All"
  | "Pending" 
  | "Confirmed" 
  | "Processing" 
  | "Packed" 
  | "Shipped" 
  | "Delivered" 
  | "Cancelled" 
  | "Returned" 
  | "Refunded" 
  | "Failed";

interface OrderNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  items: { title: string; qty: number; price: number; image: string }[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
  notes: OrderNote[];
  timeline: { step: string; time: string; completed: boolean }[];
  customerHistoryCount: number;
}

export default function AdminOrdersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [notice, setNotice] = useState("");

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "NEXA-98214",
      customerName: "Mohsin Shahzad",
      email: "mohsin@example.com",
      phone: "+92 300 1234567",
      items: [
        { title: "Ultra Wireless Headphones", qty: 1, price: 199, image: "🎧" },
        { title: "Aesthetic Oversized Hoodie", qty: 2, price: 65, image: "🧥" }
      ],
      total: 333.90,
      status: "Processing",
      date: "2026-09-26 11:30",
      address: "Main Boulevard, DHA Phase 6, Lahore",
      notes: [
        { id: "n1", author: "Admin", text: "Payment verified via Stripe.", timestamp: "2026-09-26 11:32" }
      ],
      timeline: [
        { step: "Order Placed", time: "11:30 AM", completed: true },
        { step: "Confirmed", time: "11:31 AM", completed: true },
        { step: "Processing", time: "11:35 AM", completed: true },
        { step: "Packed", time: "Pending", completed: false },
        { step: "Shipped", time: "Pending", completed: false },
        { step: "Delivered", time: "Pending", completed: false }
      ],
      customerHistoryCount: 4
    },
    {
      id: "NEXA-88342",
      customerName: "Sarah Connor",
      email: "sarah@example.com",
      phone: "+1 555 0192",
      items: [
        { title: "Ergonomic Mesh Office Chair", qty: 1, price: 149, image: "🪑" }
      ],
      total: 156.45,
      status: "Shipped",
      date: "2026-09-25 14:10",
      address: "Silicon Valley, California, USA",
      notes: [
        { id: "n2", author: "Warehouse", text: "Handed over to FedEx courier.", timestamp: "2026-09-26 09:00" }
      ],
      timeline: [
        { step: "Order Placed", time: "Sep 25", completed: true },
        { step: "Confirmed", time: "Sep 25", completed: true },
        { step: "Processing", time: "Sep 25", completed: true },
        { step: "Packed", time: "Sep 26", completed: true },
        { step: "Shipped", time: "Sep 26", completed: true },
        { step: "Delivered", time: "Pending", completed: false }
      ],
      customerHistoryCount: 1
    },
    {
      id: "NEXA-77219",
      customerName: "David Miller",
      email: "david@example.com",
      phone: "+44 20 7946 0912",
      items: [
        { title: "Microfiber Cleaning Kit", qty: 2, price: 15, image: "✨" }
      ],
      total: 31.50,
      status: "Delivered",
      date: "2026-09-24 16:45",
      address: "Baker Street, London, UK",
      notes: [],
      timeline: [
        { step: "Order Placed", time: "Sep 24", completed: true },
        { step: "Confirmed", time: "Sep 24", completed: true },
        { step: "Processing", time: "Sep 24", completed: true },
        { step: "Packed", time: "Sep 25", completed: true },
        { step: "Shipped", time: "Sep 25", completed: true },
        { step: "Delivered", time: "Sep 26", completed: true }
      ],
      customerHistoryCount: 3
    }
  ]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexa_admin_orders");
      if (saved) {
        try { setOrders(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("nexa_admin_orders", JSON.stringify(orders));
    }
  }, [orders, isMounted]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showNotice(`Order ${orderId} status updated to ${newStatus}`);
  };

  const addOrderNote = () => {
    if (!newNoteText.trim() || !selectedOrder) return;
    const newNote: OrderNote = {
      id: `note-${Date.now()}`,
      author: "Admin (Mohsin)",
      text: newNoteText.trim(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updatedOrders = orders.map(ord => {
      if (ord.id === selectedOrder.id) {
        const updatedNotes = [newNote, ...ord.notes];
        const updatedOrd = { ...ord, notes: updatedNotes };
        setSelectedOrder(updatedOrd);
        return updatedOrd;
      }
      return ord;
    });

    setOrders(updatedOrders);
    setNewNoteText("");
    showNotice("Internal note added successfully!");
  };

  const filteredOrders = orders.filter(ord => {
    const matchesTab = activeTab === "All" || ord.status === activeTab;
    const matchesSearch = ord.id.toLowerCase().includes(searchQuery.toLowerCase()) || ord.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Processing": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Packed": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Shipped": return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Returned": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Refunded": return "bg-gray-100 text-gray-700 border-gray-300";
      case "Failed": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer orders, fulfillment statuses, invoices, and tracking timelines.</p>
          </div>
          <Link href="/" className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition shadow-sm">
            ← Back to Storefront
          </Link>
        </div>

        {notice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold shadow-sm">
            {notice}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto">
          {(["All", "Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Returned", "Refunded", "Failed"] as OrderStatus[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab} ({tab === "All" ? orders.length : orders.filter(o => o.status === tab).length})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search by Order ID (e.g. NEXA-98214) or Customer Name..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 font-medium">No orders found for this status.</td>
                  </tr>
                ) : (
                  filteredOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-4 font-mono text-xs font-bold text-indigo-600">{ord.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{ord.customerName}</p>
                        <p className="text-[11px] text-gray-500">{ord.email}</p>
                      </td>
                      <td className="p-4 text-xs font-semibold text-gray-700">{ord.items.reduce((a, c) => a + c.qty, 0)} items</td>
                      <td className="p-4 font-extrabold text-gray-900">${ord.total.toFixed(2)}</td>
                      <td className="p-4 text-xs text-gray-500">{ord.date}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getStatusBadgeColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition"
                        >
                          View Details 👁️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Drawer / Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <div className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600">{selectedOrder.id}</span>
                    <h2 className="text-2xl font-extrabold text-gray-900 mt-1">{selectedOrder.customerName}</h2>
                    <p className="text-xs text-gray-500">{selectedOrder.email} • {selectedOrder.phone}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Quick Status Updater */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-900">Update Order Status</p>
                    <p className="text-[10px] text-indigo-700">Change fulfillment state instantly</p>
                  </div>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                    className="bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    {(["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Returned", "Refunded", "Failed"] as OrderStatus[]).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Documents & Printing Mocks */}
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => alert(`Generating Invoice for ${selectedOrder.id}... (PDF Download Mock)`)} className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-center transition">
                    <p className="text-lg">📄</p>
                    <p className="text-xs font-bold text-gray-800 mt-1">Invoice</p>
                  </button>
                  <button onClick={() => alert(`Generating Packing Slip for ${selectedOrder.id}... (PDF Download Mock)`)} className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-center transition">
                    <p className="text-lg">📦</p>
                    <p className="text-xs font-bold text-gray-800 mt-1">Packing Slip</p>
                  </button>
                  <button onClick={() => alert(`Generating Shipping Label for ${selectedOrder.id}... (PDF Download Mock)`)} className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-center transition">
                    <p className="text-lg">🏷️</p>
                    <p className="text-xs font-bold text-gray-800 mt-1">Shipping Label</p>
                  </button>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Order Items</h3>
                  <div className="divide-y divide-gray-100 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-gray-500">Qty: {item.qty} × ${item.price}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-gray-900">${item.price * item.qty}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-extrabold text-sm text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Order Timeline</h3>
                  <div className="space-y-2">
                    {selectedOrder.timeline.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${t.completed ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                          {t.completed ? "✓" : "•"}
                        </div>
                        <span className={`font-bold ${t.completed ? "text-gray-900" : "text-gray-400"}`}>{t.step}</span>
                        <span className="text-gray-400 ml-auto">{t.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Order History Badge */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Customer Lifetime Order History</p>
                    <p className="text-[10px] text-amber-700">{selectedOrder.customerName} has placed {selectedOrder.customerHistoryCount} total orders with NexaCommerce.</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full">
                    {selectedOrder.customerHistoryCount} Orders
                  </span>
                </div>

                {/* Internal Order Notes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Internal Order Notes</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedOrder.notes.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No notes added yet.</p>
                    ) : (
                      selectedOrder.notes.map(note => (
                        <div key={note.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between font-bold text-gray-700">
                            <span>{note.author}</span>
                            <span className="text-[10px] text-gray-400">{note.timestamp}</span>
                          </div>
                          <p className="text-gray-600">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input 
                      type="text" 
                      placeholder="Add an internal note..." 
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={addOrderNote} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
                      Add
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-xs shadow-sm transition"
                >
                  Close Drawer
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}