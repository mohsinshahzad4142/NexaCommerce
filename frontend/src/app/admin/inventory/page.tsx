"use client";
import { useState } from "react";

export default function InventoryManagementPage() {
  const [activeTab, setActiveTab] = useState("stock");
  const [selectedWarehouse, setSelectedWarehouse] = useState("All");

  // 1. Core Inventory State (Real-time, Warehouses, Reserved, Damaged, Backorders, Alerts)
  const [inventory, setInventory] = useState([
    { id: 1, sku: "SKU-HED-01", name: "Ultra Wireless Headphones", warehouse: "Lahore Main Hub", stock: 145, reserved: 12, damaged: 3, backorders: 0, minAlert: 20, status: "In Stock" },
    { id: 2, sku: "SKU-CHR-02", name: "Ergonomic Mesh Office Chair", warehouse: "Multan Central", stock: 8, reserved: 2, damaged: 1, backorders: 5, minAlert: 15, status: "Low Stock" },
    { id: 3, sku: "SKU-HOD-03", name: "Aesthetic Oversized Hoodie", warehouse: "Karachi Port Store", stock: 0, reserved: 0, damaged: 0, backorders: 14, minAlert: 10, status: "Out of Stock" },
    { id: 4, sku: "SKU-MOU-04", name: "RGB Gaming Mouse", warehouse: "Lahore Main Hub", stock: 64, reserved: 5, damaged: 0, backorders: 0, minAlert: 10, status: "In Stock" },
  ]);

  // 2. Transactions & Audit History State
  const [transactions, setTransactions] = useState([
    { id: "TRX-901", item: "Ultra Wireless Headphones", type: "Stock In", qty: +50, warehouse: "Lahore Main Hub", date: "Today, 11:00 AM" },
    { id: "TRX-902", item: "Ergonomic Mesh Office Chair", type: "Stock Adjustment", qty: -2, warehouse: "Multan Central", date: "Yesterday, 04:30 PM" },
    { id: "TRX-903", item: "Aesthetic Oversized Hoodie", type: "Backorder Fulfilled", qty: -5, warehouse: "Karachi Port Store", date: "2026-09-24" },
    { id: "TRX-904", item: "RGB Gaming Mouse", type: "Warehouse Transfer", qty: 10, warehouse: "Lahore ➔ Multan", date: "2026-09-23" },
  ]);

  // 3. Suppliers State
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "TechGadgets Ltd.", contact: "+92 300 9876543", email: "orders@techgadgets.pk", leadTime: "3-5 Days" },
    { id: 2, name: "Aesthetic Apparel Co.", contact: "+92 321 4567890", email: "supply@aestheticapparel.pk", leadTime: "7-10 Days" },
  ]);

  // 4. Purchase Orders State
  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: "PO-501", supplier: "TechGadgets Ltd.", items: "Ergonomic Mesh Office Chair (Qty: 50)", status: "Pending Delivery", date: "2026-09-20" },
    { id: "PO-502", supplier: "Aesthetic Apparel Co.", items: "Aesthetic Oversized Hoodie (Qty: 100)", status: "Received", date: "2026-09-10" },
  ]);

  // Form States for Transfer & Adjustment
  const [fromWh, setFromWh] = useState("Lahore Main Hub");
  const [toWh, setToWh] = useState("Multan Central");
  const [transferSku, setTransferSku] = useState("SKU-HED-01");
  const [transferQty, setTransferQty] = useState(10);

  const [adjSku, setAdjSku] = useState("SKU-HED-01");
  const [adjType, setAdjType] = useState("Add (+)");
  const [adjQty, setAdjQty] = useState(5);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWh === toWh) {
      alert("Source and Destination warehouses cannot be the same!");
      return;
    }
    alert(`Successfully transferred ${transferQty} units of [${transferSku}] from ${fromWh} to ${toWh}!`);
  };

  const handleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Successfully applied adjustment (${adjType} ${adjQty} units) for SKU: ${adjSku}!`);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inventory & Stock Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Enterprise stock control, multi-warehouse tracking, reserved stock, audit logs & suppliers.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            14/14 Inventory Modules Active
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        {[
          { id: "stock", label: "📦 Real-Time Stock & Warehouses" },
          { id: "operations", label: "🔄 Adjustments & Transfers" },
          { id: "history", label: "📊 Transactions & Audit History" },
          { id: "suppliers", label: "🏭 Suppliers & Purchase Orders" },
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

      {/* TAB 1: STOCK & WAREHOUSES */}
      {activeTab === "stock" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase">Warehouse:</span>
              {["All", "Lahore Main Hub", "Multan Central", "Karachi Port Store"].map(wh => (
                <button
                  key={wh}
                  onClick={() => setSelectedWarehouse(wh)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedWarehouse === wh ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  {wh}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                    <th className="py-3 px-4">SKU / Item Name</th>
                    <th className="py-3 px-4">Warehouse</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4">Reserved</th>
                    <th className="py-3 px-4">Damaged</th>
                    <th className="py-3 px-4">Backorders</th>
                    <th className="py-3 px-4">Status & Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                  {inventory
                    .filter(item => selectedWarehouse === "All" || item.warehouse === selectedWarehouse)
                    .map(item => (
                      <tr key={item.id} className="hover:bg-indigo-50/30 transition">
                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">{item.sku}</p>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-600">{item.warehouse}</td>
                        <td className="py-4 px-4 font-extrabold text-gray-900 text-sm">{item.stock} units</td>
                        <td className="py-4 px-4 text-amber-600 font-bold">{item.reserved} units</td>
                        <td className="py-4 px-4 text-rose-600 font-bold">{item.damaged} units</td>
                        <td className="py-4 px-4 text-blue-600 font-bold">{item.backorders} orders</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                            {item.status} {item.stock <= item.minAlert && item.stock > 0 && `(Low Alert)`}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADJUSTMENTS & TRANSFERS */}
      {activeTab === "operations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Manual Stock Adjustment</h3>
            <p className="text-xs text-gray-500">Correct inventory counts due to audit discrepancies or damage.</p>
            <form onSubmit={handleAdjustment} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Item SKU</label>
                <select value={adjSku} onChange={e => setAdjSku(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                  {inventory.map(i => <option key={i.id} value={i.sku}>{i.name} ({i.sku})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Action Type</label>
                  <select value={adjType} onChange={e => setAdjType(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                    <option value="Add (+)">Add Stock (+)</option>
                    <option value="Subtract (-)">Subtract Stock (-)</option>
                    <option value="Mark Damaged">Mark as Damaged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity</label>
                  <input type="number" value={adjQty} onChange={e => setAdjQty(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none" required />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition">
                Apply Stock Adjustment
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Inter-Warehouse Stock Transfer</h3>
            <p className="text-xs text-gray-500">Move inventory items securely across different regional hubs.</p>
            <form onSubmit={handleTransfer} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">From Warehouse</label>
                  <select value={fromWh} onChange={e => setFromWh(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                    <option>Lahore Main Hub</option>
                    <option>Multan Central</option>
                    <option>Karachi Port Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">To Warehouse</label>
                  <select value={toWh} onChange={e => setToWh(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                    <option>Multan Central</option>
                    <option>Lahore Main Hub</option>
                    <option>Karachi Port Store</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product SKU</label>
                <select value={transferSku} onChange={e => setTransferSku(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none">
                  {inventory.map(i => <option key={i.id} value={i.sku}>{i.name} ({i.sku})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Transfer Quantity</label>
                <input type="number" value={transferQty} onChange={e => setTransferQty(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none" required />
              </div>
              <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl text-xs transition">
                Execute Warehouse Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTIONS & HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900">Inventory Transactions & Audit Trail</h3>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Warehouse / Route</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-bold text-gray-900">{trx.id}</td>
                    <td className="py-4 px-4 font-semibold">{trx.item}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">{trx.type}</span>
                    </td>
                    <td className={`py-4 px-4 font-extrabold ${trx.qty > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>{trx.qty > 0 ? `+${trx.qty}` : trx.qty}</td>
                    <td className="py-4 px-4 text-gray-600">{trx.warehouse}</td>
                    <td className="py-4 px-4 text-gray-400">{trx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLIERS & PURCHASE ORDERS */}
      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Supplier Directory</h3>
            <div className="space-y-3 pt-2">
              {suppliers.map(sup => (
                <div key={sup.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-900 text-xs">{sup.name}</h4>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">Lead Time: {sup.leadTime}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{sup.email} • {sup.contact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Purchase Orders (PO)</h3>
            <div className="space-y-3 pt-2">
              {purchaseOrders.map(po => (
                <div key={po.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-900 text-xs">{po.id} - {po.supplier}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {po.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium">{po.items}</p>
                  <p className="text-[10px] text-gray-400">Ordered on: {po.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}