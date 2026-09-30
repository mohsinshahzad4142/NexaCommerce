"use client"

import Link from "next/link"
import { useStore, Product } from "@/context/StoreContext"

const PRODUCTS: Product[] = [
  { id: "1", name: "Mohsin Aesthetic Oversized Hoodie", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600", rating: 4.8, category: "fashion", description: "Premium fleece cotton oversized hoodie for ultimate comfort." },
  { id: "2", name: "Smart Wireless Pro Earbuds ANC", price: 5899, originalPrice: 8999, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600", rating: 4.9, category: "electronics", description: "Active noise cancellation with 30-hour battery life." },
  { id: "3", name: "Minimalist Leather Smart Watch", price: 7499, originalPrice: 11999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600", rating: 4.7, category: "electronics", description: "Classic leather strap with health and fitness tracking." },
  { id: "4", name: "Organic Glow Vitamin C Serum", price: 2199, originalPrice: 3200, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", rating: 4.8, category: "beauty", description: "Brightening facial serum with pure Vitamin C and Hyaluronic acid." }
]

export default function HomePage() {
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList, recentlyViewed, addToRecentlyViewed } = useStore()

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-gray-900 text-white py-24 px-6 text-center space-y-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-4">
          <span className="bg-indigo-500/30 border border-indigo-400/30 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-indigo-200">
            New Generation E-Commerce 🚀
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Discover Quality Products at Unbeatable Prices
          </h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Explore thousands of items with real-time stock updates, secure checkout, and instant delivery support.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="/shop" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-lg">
              Shop Now 🛍️
            </Link>
            <Link href="/flash-sales" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-2xl text-xs font-bold transition border border-white/10">
              Flash Sales ⚡
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">⚡ Flash Sales</span>
            <h2 className="text-2xl font-black text-gray-900">Hot Deals & Discounts</h2>
          </div>
          <Link href="/flash-sales" className="text-xs font-bold text-indigo-600 hover:underline">View All →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.map(product => {
            const isWishlisted = wishlist.some(item => item.id === product.id)
            const isCompared = compareList.some(item => item.id === product.id)

            return (
              <div key={product.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onClick={() => addToRecentlyViewed(product)}
                    />
                    <button 
                      onClick={() => toggleWishlist(product)} 
                      className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur rounded-full text-sm shadow hover:scale-110 transition"
                    >
                      {isWishlisted ? "❤️" : "🤍"}
                    </button>
                    <button 
                      onClick={() => toggleCompare(product)} 
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow transition ${isCompared ? 'bg-indigo-600 text-white' : 'bg-white/90 text-gray-700'}`}
                    >
                      {isCompared ? "Compared ✓" : "Compare ⚖️"}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{product.category}</span>
                      <span className="text-amber-500 font-bold">★ {product.rating}</span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-sm font-black text-indigo-600">Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="block text-[10px] text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>}
                  </div>
                  <button 
                    onClick={() => addToCart(product)} 
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-sm"
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Categories</span>
            <h2 className="text-2xl font-black text-gray-900">Top Categories</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-indigo-600 hover:underline">View All →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: "Electronics", icon: "💻", cat: "electronics" },
            { name: "Fashion", icon: "👕", cat: "fashion" },
            { name: "Home & Kitchen", icon: "🏠", cat: "home" },
            { name: "Beauty", icon: "✨", cat: "beauty" },
            { name: "Sports", icon: "⚽", cat: "sports" },
            { name: "Books", icon: "📚", cat: "books" }
          ].map((c, i) => (
            <Link key={i} href={`/shop`} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-center space-y-3 hover:border-indigo-600 transition group">
              <span className="text-3xl block group-hover:scale-110 transition">{c.icon}</span>
              <span className="text-xs font-bold text-gray-800">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-6">
          <div>
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">History</span>
            <h2 className="text-2xl font-black text-gray-900">Recently Viewed Products 👀</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map(product => (
              <div key={product.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-black text-indigo-600">Rs. {product.price.toLocaleString()}</span>
                  <button onClick={() => addToCart(product)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition">
                    Add 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
