"use client"

import { useState } from "react"
import { useStore, Product } from "@/context/StoreContext"

const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "Mohsin Aesthetic Oversized Hoodie", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600", rating: 4.8, category: "fashion", description: "Premium fleece cotton oversized hoodie for ultimate comfort." },
  { id: "2", name: "Smart Wireless Pro Earbuds ANC", price: 5899, originalPrice: 8999, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600", rating: 4.9, category: "electronics", description: "Active noise cancellation with 30-hour battery life." },
  { id: "3", name: "Minimalist Leather Smart Watch", price: 7499, originalPrice: 11999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600", rating: 4.7, category: "electronics", description: "Classic leather strap with health and fitness tracking." },
  { id: "4", name: "Organic Glow Vitamin C Serum", price: 2199, originalPrice: 3200, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", rating: 4.8, category: "beauty", description: "Brightening facial serum with pure Vitamin C and Hyaluronic acid." },
  { id: "5", name: "Ergonomic Office Desk Chair", price: 18999, originalPrice: 24999, image: "https://images.unsplash.com/photo-1580481077494-e3299acae5e7?auto=format&fit=crop&q=80&w=600", rating: 4.6, category: "home", description: "Breathable mesh back support with adjustable armrests." },
  { id: "6", name: "Pro Resistance Bands Set", price: 1499, originalPrice: 2500, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600", rating: 4.9, category: "sports", description: "5 levels of heavy-duty latex bands for home workouts." }
]

export default function ShopPage() {
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList, addToRecentlyViewed } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const filtered = ALL_PRODUCTS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Explore Our Shop 🛍️</h1>
        <p className="text-xs text-gray-500">Discover premium products with advanced filtering and instant checkout.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <input 
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-600"
        />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="electronics">Electronics</option>
            <option value="beauty">Beauty</option>
            <option value="home">Home & Kitchen</option>
            <option value="sports">Sports</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(product => {
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
