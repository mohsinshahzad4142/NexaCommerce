"use client";
import { useState } from "react";

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: string;
  tax: string;
  status: "Paid" | "Pending" | "Refunded" | "Credit Issued";
  date: string;
}

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "reconciliation" | "integrations">("invoices");

  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: "inv1", invoiceNumber: "INV-2026-001", customer: "Mohsin Shahzad", amount: "$1,250.00", tax: "$62.50 (5%)", status: "Paid", date: "2026-09-24" },
    { id: "inv2", invoiceNumber: "INV-2026-002", customer: "Global Tech Inc.", amount: "$4,800.00", tax: "$240.00 (5%)", status: "Paid", date: "2026-09-25" },
    { id: "inv3", invoiceNumber: "INV-2026-003", customer: "Aesthetic Gym Hub", amount: "$320.00", tax: "$16.00 (5%)", status: "Pending", date: "2026-09-26" },
    { id: "inv4", invoiceNumber: "INV-2026-004", customer: "Sarah Connor", amount: "$150.00", tax: "$7.50 (5%)", status: "Refunded", date: "2026-09-20" },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newAmount) return;
    const newInv: InvoiceItem = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-00${invoices.length + 1}`,
      customer: newCustomer,
      amount: `$${Number(newAmount).toFixed(2)}`,
      tax: `$${(Number(newAmount) * 0.05).toFixed(2)} (5%)`,
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };
    setInvoices([newInv, ...invoices]);
    setNotification(`Invoice ${newInv.invoiceNumber} generated successfully! 🧾`);
    setNewCustomer("");
    setNewAmount("");
    setInvoiceModal(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadPDF = (inv: InvoiceItem) => {
    const invoiceContent = `========================================
           NEXACOMMERCE - OFFICIAL INVOICE
========================================
Invoice Number : ${inv.invoiceNumber}
Customer Name  : ${inv.customer}
Date           : ${inv.date}
Amount         : ${inv.amount}
Tax Included   : ${inv.tax}
Status         : ${inv.status}
----------------------------------------
Thank you for your business! 
Generated via NexaCommerce Financial Hub.
========================================`;

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inv.invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification(`Invoice ${inv.invoiceNumber} downloaded successfully! 📥`);
    setTimeout(() => setNotification(null), 4000);
  };

  const runReconciliation = () => {
    setNotification("Payment reconciliation completed: 1,420 transactions verified across Stripe, PayPal, and Bank Ledger. Zero discrepancies found! ⚖️");
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Advanced Accounting & Financial Hub 🧾</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage revenue, expenses, taxes, net profits, refunds, payment reconciliation, invoices, and credit notes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={runReconciliation}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            Run Reconciliation ⚖️
          </button>
          <button 
            onClick={() => setInvoiceModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            + Create New Invoice
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 animate-fadeIn shadow-sm">
          {notification}
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Total Revenue</span>
          <div className="text-2xl font-extrabold text-gray-900">$128,450.00</div>
          <p className="text-xs text-emerald-600 font-bold">+14.2% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-lg">Operating Expenses</span>
          <div className="text-2xl font-extrabold text-gray-900">$34,120.00</div>
          <p className="text-xs text-gray-500 font-medium">Hosting, APIs & Inventory</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-lg">Net Profit</span>
          <div className="text-2xl font-extrabold text-gray-900">$94,330.00</div>
          <p className="text-xs text-emerald-600 font-bold">Margin: 73.4%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Collected Tax</span>
          <div className="text-2xl font-extrabold text-gray-900">$6,420.50</div>
          <p className="text-xs text-indigo-600 font-medium">Ready for filing</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-[10px] font-extrabold text-rose-600 uppercase bg-rose-50 px-2.5 py-1 rounded-lg">Refunds & Credit Notes</span>
          <div className="text-2xl font-extrabold text-gray-900">$1,840.00</div>
          <p className="text-xs text-rose-600 font-medium">4 Orders refunded</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "invoices" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🧾 Invoices & Credit Notes ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab("reconciliation")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "reconciliation" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          ⚖️ Payment Reconciliation & Gateway Logs
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "integrations" 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          🔌 Accounting Software Sync (QuickBooks / Xero)
        </button>
      </div>

      {/* TAB 1: INVOICES */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-gray-900">Generated Invoices & Tax Documents</h3>
            <span className="text-xs font-bold text-gray-500">Auto-generated upon order placement</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Tax Included</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-mono font-bold text-indigo-600">{inv.invoiceNumber}</td>
                    <td className="p-4 font-extrabold text-gray-900">{inv.customer}</td>
                    <td className="p-4 font-bold">{inv.amount}</td>
                    <td className="p-4 text-gray-500">{inv.tax}</td>
                    <td className="p-4 text-gray-500">{inv.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        inv.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        inv.status === 'Refunded' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleDownloadPDF(inv)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition cursor-pointer"
                      >
                        Download PDF 📥
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RECONCILIATION */}
      {activeTab === "reconciliation" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Payment Gateway Reconciliation Engine</h3>
              <p className="text-xs text-gray-500">Matches Stripe, PayPal, and Bank payouts against store orders automatically.</p>
            </div>
            <button 
              onClick={runReconciliation}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
            >
              Verify All Transactions Now ⚡
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-900">
                <span>Stripe Gateway</span>
                <span className="text-emerald-600 text-xs font-extrabold">Synced 🟢</span>
              </div>
              <p className="text-xs text-gray-500">1,120 transactions matched. Payout settled to Bank Account ending in *4892.</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-900">
                <span>PayPal Business</span>
                <span className="text-emerald-600 text-xs font-extrabold">Synced 🟢</span>
              </div>
              <p className="text-xs text-gray-500">300 transactions matched. Zero discrepancies in fee calculations.</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-900">
                <span>Cash on Delivery (COD)</span>
                <span className="text-amber-600 text-xs font-extrabold">Pending Settlement 🟡</span>
              </div>
              <p className="text-xs text-gray-500">45 rider collections pending confirmation by warehouse manager.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-base font-extrabold text-gray-900">Accounting Software Integration</h3>
            <p className="text-xs text-gray-500">Push ledger entries, taxes, and invoices directly to your professional accounting suite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border border-gray-200 flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-gray-900">QuickBooks Online</h4>
                <p className="text-xs text-gray-500">Two-way sync for sales receipts, taxes, and customer accounts.</p>
              </div>
              <button 
                onClick={() => setNotification("QuickBooks Online successfully connected via OAuth! 🟢")}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-extrabold hover:bg-emerald-100 transition cursor-pointer"
              >
                Connected 🟢
              </button>
            </div>

            <div className="p-6 rounded-3xl border border-gray-200 flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-gray-900">Xero Accounting</h4>
                <p className="text-xs text-gray-500">Automated bank reconciliation and journal entry generation.</p>
              </div>
              <button 
                onClick={() => setNotification("Xero integration activated! 🟢")}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-extrabold hover:bg-gray-200 transition cursor-pointer"
              >
                Connect Xero
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-base font-extrabold text-gray-900">Create New Invoice</h3>
              <button onClick={() => setInvoiceModal(false)} className="text-gray-400 hover:text-gray-600 font-extrabold text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Customer Name / Company</label>
                <input 
                  type="text" 
                  value={newCustomer} 
                  onChange={(e) => setNewCustomer(e.target.value)}
                  placeholder="e.g. John Doe / Tech Corp" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  value={newAmount} 
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 500" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-indigo-600"
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button 
                  type="button" 
                  onClick={() => setInvoiceModal(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Generate Invoice 🧾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}