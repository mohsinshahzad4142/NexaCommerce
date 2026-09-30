"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
            NexaCommerce
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <Link href="/products" className="hover:text-indigo-600 transition">Shop</Link>
            <Link href="/categories" className="hover:text-indigo-600 transition">Categories</Link>
            <Link href="/flash-sales" className="hover:text-indigo-600 transition text-red-600 font-semibold">Flash Sales</Link>
          </nav>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="p-2 text-gray-700 hover:text-indigo-600 transition relative">
            ❤️ <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
          <Link href="/cart" className="p-2 text-gray-700 hover:text-indigo-600 transition relative flex items-center gap-1 font-medium">
            🛒 <span className="bg-gray-100 px-2 py-0.5 rounded-md text-xs">0 items</span>
          </Link>
          <Link href="/account" className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
            Sign In
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm"
          />
          <Link href="/products" className="block text-gray-700 font-medium">Shop</Link>
          <Link href="/categories" className="block text-gray-700 font-medium">Categories</Link>
          <Link href="/flash-sales" className="block text-red-600 font-medium">Flash Sales</Link>
        </div>
      )}
    </header>
  );
}