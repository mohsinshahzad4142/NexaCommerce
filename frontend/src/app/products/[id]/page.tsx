"use client";
import { useState } from "react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import Link from "next/link";

export default function ProductDetailPage() {
  const [bundleChecked, setBundleChecked] = useState(true);
  const mainPrice = 199;
  const accessoryPrice = 29;
  const bundleTotal = bundleChecked ? mainPrice + accessoryPrice : mainPrice;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Main Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-9xl">
            🎧
          </div>
          <div className="space-y-6">
            <span className="text-xs font-semibold text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">Electronics</span>
            <h1 className="text-3xl font-extrabold text-gray-900">Wireless Noise Cancelling Headphones</h1>
            <div className="text-3xl font-extrabold text-gray-900">$199.00</div>
            <p className="text-sm text-gray-600">Experience premium sound quality with active noise cancellation and 30-hour battery life.</p>
            
            <div className="flex gap-4 pt-4">
              <Link href="/cart" className="flex-1 bg-indigo-600 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition">
                Add to Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Module */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Frequently Bought Together</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 rounded-2xl border">
            <div className="flex items-center gap-4 text-3xl font-bold">
              <div className="w-20 h-20 bg-white rounded-xl border flex items-center justify-center">🎧</div>
              <span>+</span>
              <div className="w-20 h-20 bg-white rounded-xl border flex items-center justify-center">💼</div>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-gray-900">Headphones + Hard Carrying Case</h4>
              <p className="text-xs text-gray-500">Protect your gear on the go with a custom-fit shockproof case.</p>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={bundleChecked} 
                  onChange={(e) => setBundleChecked(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                Add Carrying Case (+${accessoryPrice}.00)
              </label>
            </div>
            <div className="text-right space-y-3">
              <div>
                <span className="text-xs text-gray-400 block">Total Bundle Price</span>
                <span className="text-2xl font-extrabold text-gray-900">${bundleTotal}.00</span>
              </div>
              <Link href="/cart" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
                Add Both to Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Module */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { id: "2", title: "Ultra HD 4K Action Camera", price: "$299", image: "📸", category: "Cameras" },
              { id: "3", title: "Smart Fitness Watch Series 5", price: "$199", image: "⌚", category: "Wearables" },
              { id: "4", title: "Designer Leather Backpack", price: "$129", image: "🎒", category: "Fashion" }
            ].map(item => (
              <Link key={item.id} href={`/products/${item.id}`} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition space-y-3 group">
                <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-6xl group-hover:scale-105 transition">
                  {item.image}
                </div>
                <div>
                  <span className="text-xs text-indigo-600 font-semibold">{item.category}</span>
                  <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition">{item.title}</h4>
                  <p className="text-sm font-extrabold text-gray-900 mt-1">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}