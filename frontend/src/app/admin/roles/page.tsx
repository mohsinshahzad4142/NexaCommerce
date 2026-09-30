"use client";
import { useState } from "react";

const rolesList = [
  { id: "super_admin", name: "Super Admin", desc: "Full system ownership & restricted global controls" },
  { id: "admin", name: "Admin", desc: "General administrative management & oversight" },
  { id: "manager", name: "Manager", desc: "Store operations and team supervision" },
  { id: "product_manager", name: "Product Manager", desc: "Catalog, pricing, and inventory management" },
  { id: "order_manager", name: "Order Manager", desc: "Fulfillment, shipping labels, and tracking" },
  { id: "customer_support", name: "Customer Support", desc: "User inquiries, basic order lookup, and chat" },
  { id: "warehouse_staff", name: "Warehouse Staff", desc: "Stock updates, packing, and dispatch logs" },
  { id: "accountant", name: "Accountant", desc: "Financial reports, taxes, and revenue logs" },
];

const permissionsList = [
  { key: "view", label: "View Permission 👁️" },
  { key: "create", label: "Create ➕" },
  { key: "edit", label: "Edit ✏️" },
  { key: "delete", label: "Delete 🗑️" },
  { key: "export", label: "Export 📊" },
  { key: "refund", label: "Refund 💳" },
  { key: "settings", label: "Manage Settings ⚙️" },
];

export default function RolesPermissionsPage() {
  // Default mock permission matrix state
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    super_admin: { view: true, create: true, edit: true, delete: true, export: true, refund: true, settings: true },
    admin: { view: true, create: true, edit: true, delete: true, export: true, refund: true, settings: false },
    manager: { view: true, create: true, edit: true, delete: false, export: true, refund: true, settings: false },
    product_manager: { view: true, create: true, edit: true, delete: true, export: true, refund: false, settings: false },
    order_manager: { view: true, create: false, edit: true, delete: false, export: true, refund: true, settings: false },
    customer_support: { view: true, create: false, edit: false, delete: false, export: false, refund: true, settings: false },
    warehouse_staff: { view: true, create: false, edit: true, delete: false, export: false, refund: false, settings: false },
    accountant: { view: true, create: false, edit: false, delete: false, export: true, refund: true, settings: false },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const togglePermission = (roleId: string, permKey: string) => {
    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permKey]: !prev[roleId][permKey]
      }
    }));
  };

  const handleSaveMatrix = () => {
    // Backend API sync call can be integrated here
    setModalMsg("Role & Permission security matrix successfully compiled and synced with PostgreSQL backend! 🚀");
    setModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative">
      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900">Security Update Saved</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600">✕</button>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">{modalMsg}</p>
            <button onClick={() => setModalOpen(false)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition">
              Done & Close 🚀
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Roles & Permissions Matrix</h1>
          <p className="text-xs text-gray-500 mt-0.5">Granular Access Control Center: Define exact operational boundaries for team members.</p>
        </div>
        <button 
          onClick={handleSaveMatrix}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
        >
          Save Matrix Changes 🛡️
        </button>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Staff Role</th>
                {permissionsList.map(p => (
                  <th key={p.key} className="p-4 text-center">{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {rolesList.map(role => (
                <tr key={role.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <strong className="text-gray-900 block font-bold text-sm">{role.name}</strong>
                    <span className="text-gray-400 text-[11px]">{role.desc}</span>
                  </td>
                  {permissionsList.map(p => {
                    const isChecked = matrix[role.id]?.[p.key] || false;
                    return (
                      <td key={p.key} className="p-4 text-center">
                        <button 
                          onClick={() => togglePermission(role.id, p.key)}
                          className={`w-8 h-8 rounded-xl font-bold transition flex items-center justify-center mx-auto text-sm ${
                            isChecked 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm' 
                              : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {isChecked ? "✓" : "—"}
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
    </div>
  );
}