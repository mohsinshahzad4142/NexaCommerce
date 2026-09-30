"use client"

import { useState, useEffect } from "react"
import { useStore, Product } from "@/context/StoreContext"

const FLASH_PRODUCTS: Product[] = [
  { id: "1", name: "Mohsin Aesthetic Oversized Hoodie", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600", rating: 4.8, category: "fashion", description: "Premium fleece cotton oversized hoodie for ultimate comfort." },
  { id: "2", name: "Smart Wireless Pro Earbuds ANC", price: 5899, originalPrice: 8999, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600", rating: 4.9, category: "electronics", description: "Active noise cancellation with 30-hour battery life." },
  { id: "3", name: "Minimalist Leather Smart Watch", price: 7499, originalPrice: 11999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600", rating: 4.7, category: "electronics", description: "Classic leather strap with health and fitness tracking." },
  { id: "4", name: "Organic Glow Vitamin C Serum", price: 2199, originalPrice: 3200, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", rating: 4.8, category: "beauty", description: "Brightening facial serum with pure Vitamin C and Hyaluronic acid." }
]

export default function FlashSalesPage() {
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList, addToRecentlyViewed } = useStore()
  
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 30 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="bg-gradient-to-r from-rose-500 to-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-white/20 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest">Limited Time Deal ⚡</span>
          <h1 className="text-3xl font-black">Flash Sales & Mega Discounts</h1>
          <p className="text-xs text-white/90">Grab your favorite items at unbeatable markdown prices before time runs out!</p>
        </div>
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-xl font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="block text-[9px] uppercase tracking-wider text-white/70">Hours</span>
          </div>
          <span className="text-xl font-bold">:</span>
          <div className="text-center">
            <span className="text-xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="block text-[9px] uppercase tracking-wider text-white/70">Mins</span>
          </div>
          <span className="text-xl font-bold">:</span>
          <div className="text-center">
            <span className="text-xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="block text-[9px] uppercase tracking-wider text-white/70">Secs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {FLASH_PRODUCTS.map(product => {
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
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow">
                    -30% OFF 🔥
                  </span>
                  <button 
                    onClick={() => toggleWishlist(product)} 
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur rounded-full text-sm shadow hover:scale-110 transition"
                  >
                    {isWishlisted ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{product.category}</span>
                    <span className="text-amber-500 font-bold">★ {product.rating}</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{product.description}</p>
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
    </div>
  )
}
