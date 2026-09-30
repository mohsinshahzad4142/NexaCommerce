"use client";
import { useState } from "react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [newNote, setNewNote] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Mohsin Shahzad",
      email: "mohsin@example.com",
      phone: "+92 300 1234567",
      group: "VIP",
      status: "Active",
      ordersCount: 5,
      totalSpent: 45200,
      joinedDate: "2026-06-12",
      addresses: ["House 123, Street 4, Multan", "Office Plaza, Gulberg, Lahore"],
      notes: ["Prefers fast shipping", "VIP customer with frequent high-ticket orders."],
      wishlist: ["Ultra Wireless Headphones", "Ergonomic Mesh Office Chair"],
      reviews: ["5 Stars - Excellent sound quality!", "4 Stars - Very comfortable chair."],
      activity: [
        { time: "Today, 02:30 PM", action: "Logged in via Google Authentication" },
        { time: "Yesterday, 11:15 AM", action: "Placed Order #ORD-1045 (Rs. 29,800)" },
        { time: "2026-08-10", action: "Submitted a 5-star product review" },
        { time: "2026-06-12", action: "Account registered successfully" }
      ],
      orders: [
        { id: "ORD-1001", date: "2026-08-10", total: 15400, status: "Delivered" },
        { id: "ORD-1045", date: "2026-09-01", total: 29800, status: "Processing" }
      ]
    },
    {
      id: 2,
      name: "Sarah Connor",
      email: "sarah@example.com",
      phone: "+92 321 9876543",
      group: "Regular",
      status: "Active",
      ordersCount: 2,
      totalSpent: 18500,
      joinedDate: "2026-07-01",
      addresses: ["Appartment 4B, Clifton, Karachi"],
      notes: ["Asked about return policy on apparel."],
      wishlist: ["Aesthetic Oversized Hoodie"],
      reviews: ["5 Stars - Awesome hoodie fabric!"],
      activity: [
        { time: "2026-09-02", action: "Updated shipping address in profile" },
        { time: "2026-07-01", action: "Account registered via Email/Password" }
      ],
      orders: [
        { id: "ORD-1022", date: "2026-07-15", total: 18500, status: "Delivered" }
      ]
    },
    {
      id: 3,
      name: "Ali Khan",
      email: "ali@example.com",
      phone: "+92 333 5554433",
      group: "Wholesale",
      status: "Blocked",
      ordersCount: 8,
      totalSpent: 92100,
      joinedDate: "2026-05-20",
      addresses: ["Commercial Market, Saddar, Rawalpindi"],
      notes: ["Blocked temporarily due to disputed chargeback."],
      wishlist: [],
      reviews: ["3 Stars - Delivery was slightly delayed."],
      activity: [
        { time: "2026-08-20", action: "Admin blocked customer account" },
        { time: "2026-05-20", action: "Account registered as Wholesale" }
      ],
      orders: [
        { id: "ORD-980", date: "2026-06-05", total: 92100, status: "Delivered" }
      ]
    }
  ]);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search);
    const matchesGroup = filterGroup === "ALL" || c.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const toggleBlockStatus = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomers(customers.map(c => {
      if (c.id === id) {
        const newStatus = c.status === "Active" ? "Blocked" : "Active";
        return { ...c, status: newStatus };
      }
      return c;
    }));
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer({
        ...selectedCustomer,
        status: selectedCustomer.status === "Active" ? "Blocked" : "Active"
      });
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCustomer) return;
    const updatedNotes = [...selectedCustomer.notes, newNote];
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, notes: updatedNotes } : c));
    setSelectedCustomer({ ...selectedCustomer, notes: updatedNotes });
    setNewNote("");
  };

  const updateCustomerGroup = (newGroup: string) => {
    if (!selectedCustomer) return;
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, group: newGroup } : c));
    setSelectedCustomer({ ...selectedCustomer, group: newGroup });
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Customer Management / CRM Suite</h1>
          <p className="text-xs text-gray-500 mt-0.5">View buyer profiles, lifetime value, groups, activity timeline, notes & order history.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-700">
            Total Buyers: {customers.length} Active
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs w-full sm:w-96 focus:outline-none focus:border-indigo-500 font-medium"
          />
          <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto">
            {["ALL", "VIP", "Regular", "Wholesale"].map(grp => (
              <button
                key={grp}
                onClick={() => setFilterGroup(grp)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${filterGroup === grp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {grp === "ALL" ? "All Groups" : grp}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Customer Name / Email</th>
                <th className="py-3 px-4">Group / VIP</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Lifetime Value (LTV)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 font-bold">No customers found matching your filters.</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedCustomer(c)} className="hover:bg-indigo-50/40 transition cursor-pointer">
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">{c.name}</p>
                      <p className="text-[11px] text-gray-400">{c.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${c.group === 'VIP' ? 'bg-purple-100 text-purple-700' : c.group === 'Wholesale' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {c.group}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{c.phone}</td>
                    <td className="py-4 px-4 font-bold text-gray-800">{c.ordersCount} Orders</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">Rs. {c.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); }} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition">View CRM</button>
                      <button onClick={(e) => toggleBlockStatus(c.id, e)} className={`px-3 py-1.5 font-bold rounded-xl transition ${c.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                        {c.status === 'Active' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER CRM DEEP PROFILE DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto p-8 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-gray-900">{selectedCustomer.name}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${selectedCustomer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {selectedCustomer.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{selectedCustomer.email} • {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 transition">✕ Close</button>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
              <div>
                <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Customer Lifetime Value</p>
                <p className="text-base font-extrabold text-indigo-900 mt-0.5">Rs. {selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Total Orders Placed</p>
                <p className="text-base font-extrabold text-indigo-900 mt-0.5">{selectedCustomer.ordersCount} Orders</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Customer Group</p>
                <select value={selectedCustomer.group} onChange={(e) => updateCustomerGroup(e.target.value)} className="mt-1 bg-white border border-indigo-200 text-xs font-bold text-indigo-800 rounded-lg px-2 py-1 focus:outline-none">
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
              </div>
            </div>

            {/* Customer Activity Timeline */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Customer Activity Timeline</h3>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                {selectedCustomer.activity.map((act: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 mt-1 rounded-full bg-indigo-600 shrink-0"></span>
                    <div>
                      <p className="font-bold text-gray-900">{act.action}</p>
                      <p className="text-[10px] text-gray-400">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Saved Addresses</h3>
              <div className="space-y-1.5">
                {selectedCustomer.addresses.map((addr: string, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl text-xs font-medium text-gray-700 border border-gray-100 flex items-center gap-2">
                    <span>📍</span> {addr}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Order History</h3>
              <div className="space-y-2">
                {selectedCustomer.orders.map((ord: any) => (
                  <div key={ord.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{ord.id} • <span className="text-gray-500 font-normal">{ord.date}</span></p>
                      <span className="text-[10px] text-indigo-600 font-bold">{ord.status}</span>
                    </div>
                    <span className="font-extrabold text-emerald-600">Rs. {ord.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Wishlist ({selectedCustomer.wishlist.length})</h3>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                  {selectedCustomer.wishlist.length === 0 ? <p className="text-gray-400">No items in wishlist.</p> : selectedCustomer.wishlist.map((item: string, i: number) => <p key={i} className="font-medium text-gray-700">• {item}</p>)}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Reviews Submitted</h3>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                  {selectedCustomer.reviews.length === 0 ? <p className="text-gray-400">No reviews submitted.</p> : selectedCustomer.reviews.map((rev: string, i: number) => <p key={i} className="font-medium text-gray-700">• {rev}</p>)}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Customer Notes & CRM Logs</h3>
              <div className="space-y-2">
                {selectedCustomer.notes.map((note: string, idx: number) => (
                  <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-900 font-medium">
                    📝 {note}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a private customer note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
                <button onClick={handleAddNote} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm">Add Note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}