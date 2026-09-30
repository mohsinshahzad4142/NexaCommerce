"use client";
import { useState } from "react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: string;
  target: string;
  minOrder: string;
  maxDiscount: string;
  expiry: string;
  usageLimit: string;
  isFirstOrder: boolean;
  status: "Active" | "Expired";
}

export default function DiscountsHubPage() {
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("Percentage discount");
  const [discountValue, setDiscountValue] = useState("");
  const [targetScope, setTargetScope] = useState("Storewide");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [isUserSpecific, setIsUserSpecific] = useState(false);
  const [specificUser, setSpecificUser] = useState("");

  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: "1", code: "EID2026", type: "Percentage discount", value: "20%", target: "Storewide", minOrder: "Rs. 1000", maxDiscount: "Rs. 2000", expiry: "2026-06-30", usageLimit: "500", isFirstOrder: false, status: "Active" },
    { id: "2", code: "WELCOME500", type: "Fixed discount", value: "Rs. 500", target: "New Customers", minOrder: "Rs. 1500", maxDiscount: "N/A", expiry: "2026-12-31", usageLimit: "1 per user", isFirstOrder: true, status: "Active" },
    { id: "3", code: "BOGO_SHIRT", type: "Buy X Get Y", value: "Buy 1 Get 1", target: "Aesthetic Wear", minOrder: "Rs. 3000", maxDiscount: "N/A", expiry: "2026-03-15", usageLimit: "100", isFirstOrder: false, status: "Expired" },
  ]);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation check: Required fields
    if (!code.trim() || !discountValue.trim()) {
      setNotification({ text: "Please fill in the required fields: Coupon Code and Discount Value! ⚠️", type: "error" });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: code.toUpperCase().trim(),
      type: discountType,
      value: discountValue.trim(),
      target: targetScope,
      minOrder: minOrder ? `Rs. ${minOrder}` : "None",
      maxDiscount: maxDiscount ? `Rs. ${maxDiscount}` : "N/A",
      expiry: expiryDate || "2026-12-31",
      usageLimit: usageLimit || "Unlimited",
      isFirstOrder: isFirstOrder,
      status: "Active",
    };

    setCoupons([newCoupon, ...coupons]);
    
    // Reset form fields
    setCode("");
    setDiscountValue("");
    setMinOrder("");
    setMaxDiscount("");
    setExpiryDate("");
    setUsageLimit("");
    setIsFirstOrder(false);
    setIsUserSpecific(false);
    setSpecificUser("");

    setNotification({ text: `Success! Coupon "${newCoupon.code}" created and activated successfully! 🎉`, type: "success" });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Coupons & Discounts Management Hub</h1>
          <p className="text-xs text-gray-500 mt-1">Enterprise promotion engine with all 12 advanced discount rules and voucher campaigns.</p>
        </div>
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-extrabold">Active Module 🟢</span>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-bold shadow-sm transition-all ${
          notification.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
        }`}>
          {notification.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-sm font-extrabold text-gray-900">Generate New Discount Voucher (Advanced Rules)</h3>
          <p className="text-xs text-gray-500 mt-0.5">Configure percentage, fixed, product/category specific, BOGO, usage limits, and user restrictions.</p>
        </div>
        
        <form onSubmit={handleCreateCoupon} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Coupon Code <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. SUMMER50" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Discount Type</label>
              <select 
                value={discountType} 
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              >
                <option value="Percentage discount">Percentage discount (%)</option>
                <option value="Fixed discount">Fixed discount (Flat)</option>
                <option value="Buy X Get Y">Buy X Get Y (Bundle)</option>
                <option value="Free shipping coupon">Free shipping coupon</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Discount Value <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. 20% or 500" 
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Target Scope</label>
              <select 
                value={targetScope} 
                onChange={(e) => setTargetScope(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              >
                <option value="Storewide">Storewide (All Products)</option>
                <option value="Product-specific">Product-specific (Selected SKUs)</option>
                <option value="Category-specific">Category-specific (Categories)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Minimum Order Amount (Rs.)</label>
              <input 
                type="number" 
                placeholder="e.g. 1000" 
                value={minOrder} 
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Maximum Discount Cap (Rs.)</label>
              <input 
                type="number" 
                placeholder="e.g. 5000" 
                value={maxDiscount} 
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Expiry Date</label>
              <input 
                type="date" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Usage Limit</label>
              <input 
                type="text" 
                placeholder="e.g. 100 uses" 
                value={usageLimit} 
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">User-Specific Email / ID</label>
              <input 
                type="text" 
                placeholder="e.g. vip@customer.com" 
                value={specificUser} 
                onChange={(e) => setSpecificUser(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isFirstOrder} 
                onChange={(e) => setIsFirstOrder(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-gray-800">First-order coupon only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isUserSpecific} 
                onChange={(e) => setIsUserSpecific(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-gray-800">Restrict to specific user account</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Create Advanced Coupon</span>
              <span>⚡</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-gray-900">Active & Past Promo Codes Directory</h3>
          <span className="text-xs font-bold text-gray-500">Total Vouchers: {coupons.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Target Scope</th>
                <th className="p-4">Min Order / Max Cap</th>
                <th className="p-4">Expiry</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono font-extrabold text-indigo-600">{c.code}</td>
                  <td className="p-4 font-bold text-gray-900">{c.type}</td>
                  <td className="p-4 text-emerald-600 font-extrabold">{c.value}</td>
                  <td className="p-4 text-gray-600">
                    {c.target} 
                    {c.isFirstOrder && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold ml-1">First Order</span>}
                  </td>
                  <td className="p-4 text-gray-500">{c.minOrder} / {c.maxDiscount}</td>
                  <td className="p-4 font-mono text-gray-500">{c.expiry}</td>
                  <td className="p-4 text-right">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold ${
                      c.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {c.status} {c.status === "Active" ? "🟢" : "🔴"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}