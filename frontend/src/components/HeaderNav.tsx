"use client"

import Link from "next/link"
import { useStore } from "@/context/StoreContext"

export default function HeaderNav() {
  const { cart, wishlist } = useStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-2 border-b border-gray-100 flex justify-between items-center text-[11px] text-gray-500">
        <div className="flex gap-6 font-medium">
          <Link href="/customer-service" className="hover:text-indigo-600 transition">Customer Service</Link>
          <Link href="/track-order" className="hover:text-indigo-600 transition">Track Order</Link>
          <Link href="/help-center" className="hover:text-indigo-600 transition">Help Center</Link>
          <Link href="/returns" className="hover:text-indigo-600 transition">Returns & Refunds</Link>
        </div>
        <div>
          <span>📞 Hotline: <strong className="text-gray-800">+92 300 1234567</strong></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-black text-indigo-600 tracking-tight">
          NexaCommerce 🛍️
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/shop" className="text-xs font-bold text-gray-700 hover:text-indigo-600 transition">Shop</Link>
          <Link href="/categories" className="text-xs font-bold text-gray-700 hover:text-indigo-600 transition">Categories</Link>
          <Link href="/flash-sales" className="text-xs font-bold text-gray-700 hover:text-indigo-600 transition">Flash Sales</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/wishlist" className="relative p-2.5 bg-gray-100 hover:bg-gray-200 rounded-2xl transition text-sm">
            ❤️
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2.5 bg-gray-100 hover:bg-gray-200 rounded-2xl transition text-sm">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/auth/signin" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}
