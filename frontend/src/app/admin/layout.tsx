import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Master Admin Sidebar with all 22 Links and Scrollbar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col p-3 space-y-1 shrink-0 h-screen sticky top-0 shadow-xl">
        <div className="border-b border-gray-800 pb-2.5 px-2">
          <h2 className="text-base font-extrabold tracking-wide text-indigo-400">NexaCommerce ⚡</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Enterprise Admin (22 Modules)</p>
        </div>

        {/* Scrollable Navigation List containing all 22 Modules */}
        <nav className="space-y-0.5 text-xs font-bold flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <Link href="/admin" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📊 Dashboard Overview
          </Link>
          <Link href="/admin/analytics" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📈 Analytics & GA4 Hub
          </Link>
          <Link href="/admin/orders" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🛍️ Orders Management
          </Link>
          <Link href="/admin/products" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📦 Products Catalog
          </Link>
          <Link href="/admin/inventory" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📊 Inventory Control
          </Link>
          <Link href="/admin/customers" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            👥 Customers Directory
          </Link>
          <Link href="/admin/discounts" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🏷️ Coupons & Discounts
          </Link>
          <Link href="/admin/marketing" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📢 Marketing Campaigns
          </Link>
          <Link href="/admin/seo" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🔍 SEO & Metadata Hub
          </Link>
          <Link href="/admin/shipping" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🚚 Shipping & Delivery
          </Link>
          <Link href="/admin/payments" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            💳 Payments & Gateways
          </Link>
          <Link href="/admin/security" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🔐 Security & Compliance
          </Link>
          <Link href="/admin/ai-features" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🤖 AI Features
          </Link>
          <Link href="/admin/plugins" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🔌 Plugin / Extensions
          </Link>
          <Link href="/admin/integrations" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            ⚡ API & Integrations
          </Link>
          <Link href="/admin/multistore" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🏢 Multi-Store / Vendor
          </Link>
          <Link href="/admin/performance" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🚀 Performance Engine
          </Link>
          <Link href="/admin/mobile" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📱 Mobile App & PWA
          </Link>
          <Link href="/admin/accounting" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            📊 Accounting & Ledger
          </Link>
          <Link href="/admin/automation" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            ⚙️ Workflow Automation
          </Link>
          <Link href="/admin/developer" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            🛠️ Developer / Prod
          </Link>
          <Link href="/admin/settings" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300 transition">
            ⚙️ Store Settings
          </Link>
        </nav>

        <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-500 px-2">
          Logged in as Super Admin
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}