"use client"

import { useStore } from "@/context/StoreContext"
import Link from "next/link"

export default function ComparePage() {
  const { compareList, toggleCompare, addToCart } = useStore()

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
        <h1 className="text-3xl font-black text-gray-900">Product Comparison ⚖️</h1>
        <p className="text-xs text-gray-500">No products selected for comparison yet. Explore our shop and add items to compare.</p>
        <div>
          <Link href="/shop" className="inline-block mt-4 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-sm">
            Go to Shop 🛍️
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Product Comparison Matrix ⚖️</h1>
          <p className="text-xs text-gray-500">Analyze features, prices, and specs side-by-side.</p>
        </div>
        <Link href="/shop" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-2xl text-xs font-bold text-gray-700 transition">
          ← Back to Shop
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left text-xs font-bold text-gray-400 w-44">Specifications</th>
              {compareList.map(item => (
                <th key={item.id} className="p-4 text-center align-top min-w-[240px]">
                  <div className="space-y-3 relative bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <button onClick={() => toggleCompare(item)} className="absolute top-2 right-2 p-1 bg-white hover:bg-gray-200 rounded-full text-xs text-gray-600 shadow-sm">✕</button>
                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-2xl mx-auto border border-gray-200 shadow-sm" />
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Price</td>
              {compareList.map(item => (
                <td key={item.id} className="p-4 text-center font-black text-indigo-600 text-sm">
                  Rs. {item.price.toLocaleString()}
                  {item.originalPrice && <span className="block text-[10px] text-gray-400 line-through font-normal">Rs. {item.originalPrice.toLocaleString()}</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Category</td>
              {compareList.map(item => (
                <td key={item.id} className="p-4 text-center font-semibold text-gray-600 uppercase tracking-wider">{item.category}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Rating & Reviews</td>
              {compareList.map(item => (
                <td key={item.id} className="p-4 text-center font-bold text-amber-500">★ {item.rating} / 5.0</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Stock Availability</td>
              {compareList.map(item => (
                <td key={item.id} className="p-4 text-center font-bold text-emerald-600">In Stock ✓ (Ready to Ship)</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Quick Action</td>
              {compareList.map(item => (
                <td key={item.id} className="p-4 text-center">
                  <button onClick={() => addToCart(item)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-sm">
                    Add to Cart 🛒
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
