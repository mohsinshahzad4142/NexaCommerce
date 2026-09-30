"use client";
import { useState } from "react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import Link from "next/link";

export default function ProductsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState("featured");

  const allProducts = [
    { id: "1", title: "Wireless Noise Cancelling Headphones", price: 199, category: "Electronics", rating: 4.8, image: "🎧", badge: "Sale" },
    { id: "2", title: "Ultra HD 4K Action Camera", price: 299, category: "Electronics", rating: 4.6, image: "📸", badge: "New" },
    { id: "3", title: "Smart Fitness Watch Series 5", price: 199, category: "Wearables", rating: 4.7, image: "⌚", badge: "Popular" },
    { id: "4", title: "Designer Leather Backpack", price: 129, category: "Fashion", rating: 4.5, image: "🎒", badge: "" },
    { id: "5", title: "Ergonomic Mechanical Keyboard", price: 149, category: "Electronics", rating: 4.9, image: "⌨️", badge: "Sale" },
    { id: "6", title: "Running Sports Shoes", price: 89, category: "Fashion", rating: 4.3, image: "👟", badge: "" },
  ];

  // Filter logic
  const filtered = allProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "low-high") return a.price - b.price;
    if (sortBy === "high-low") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // featured
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Product Catalog</h1>
            <p className="text-sm text-gray-500 mt-1">Explore our wide range of premium electronics, fashion, and accessories.</p>
          </div>
          
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border shadow-sm">
            <span className="text-xs font-semibold text-gray-500 pl-2">Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-900 outline-none pr-2 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-fit">
            <h3 className="font-bold text-gray-900 text-base border-b pb-3">Filters</h3>
            
            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Search Products</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name..."
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Category</label>
              <div className="space-y-1">
                {["All", "Electronics", "Wearables", "Fashion"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${selectedCategory === cat ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-600">Max Price</label>
                <span className="text-sm font-bold text-indigo-600">${maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="500" 
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-sm text-gray-500 font-medium">Showing {sorted.length} results</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.name ? null : sorted.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition space-y-4 group">
                  <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-7xl group-hover:scale-105 transition relative">
                    {product.image}
                    {product.badge && (
                      <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-indigo-600 font-semibold">{product.category}</span>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">{product.title}</h4>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-extrabold text-gray-900">${product.price}.00</span>
                      <span className="text-amber-500 font-bold text-sm">★ {product.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border p-8 space-y-3">
                <div className="text-4xl">🔍</div>
                <h3 className="font-bold text-gray-900 text-lg">No products found</h3>
                <p className="text-sm text-gray-500">Try adjusting your price filter or search query.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}