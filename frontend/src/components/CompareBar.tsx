"use client"

import { useStore } from "@/context/StoreContext"
import Link from "next/link"

export default function CompareBar() {
  const { compareList, toggleCompare } = useStore()
  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur text-white px-6 py-3.5 rounded-3xl shadow-2xl flex items-center gap-6 border border-gray-800">
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-extrabold bg-indigo-600 px-3 py-1 rounded-xl uppercase tracking-wider">Compare ({compareList.length}/3)</span>
        <div className="flex items-center gap-3">
          {compareList.map(item => (
            <div key={item.id} className="relative group bg-gray-800 p-1.5 rounded-2xl flex items-center gap-2 border border-gray-700">
              <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-xl" />
              <span className="text-[11px] font-medium max-w-[110px] truncate">{item.name}</span>
              <button onClick={() => toggleCompare(item)} className="text-gray-400 hover:text-white text-xs px-1.5 font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>
      <Link href="/compare" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-bold transition shadow-sm">
        Compare Now ⚡
      </Link>
    </div>
  )
}
