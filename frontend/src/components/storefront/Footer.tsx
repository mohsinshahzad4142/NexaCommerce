export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">NexaCommerce</h3>
          <p className="text-sm text-gray-400">
            Your ultimate destination for lightning-fast, modern online shopping built with cutting-edge technology.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/products" className="hover:text-white transition">All Products</a></li>
            <li><a href="/flash-sales" className="hover:text-white transition">Flash Sales</a></li>
            <li><a href="/categories" className="hover:text-white transition">Categories</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/track-order" className="hover:text-white transition">Track Order</a></li>
            <li><a href="/support" className="hover:text-white transition">Help Center</a></li>
            <li><a href="/returns" className="hover:text-white transition">Returns & Refunds</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-3">Subscribe to get special offers and once-in-a-lifetime deals.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none" />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} NexaCommerce. All rights reserved. Powered by Next.js & FastAPI.
      </div>
    </footer>
  );
}