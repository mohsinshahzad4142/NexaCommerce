"use client"
import { useState } from "react"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [status, setStatus] = useState<any>(null)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId) {
      setStatus({
        id: orderId,
        status: "In Transit 🚚",
        eta: "Tomorrow by 5:00 PM",
        carrier: "Nexa Express Logistics"
      })
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-gray-900">Track Your Order 📦</h1>
          <p className="text-xs text-gray-500">Enter your order ID to get real-time delivery status.</p>
        </div>
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Order ID</label>
            <input 
              type="text" 
              required
              placeholder="e.g. NX-98421" 
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
            Track Shipment 🔍
          </button>
        </form>
        {status && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-2">
            <p className="font-bold text-indigo-900">Order: {status.id}</p>
            <p className="text-gray-600">Status: <span className="font-bold text-emerald-600">{status.status}</span></p>
            <p className="text-gray-600">Expected Delivery: <span className="font-bold">{status.eta}</span></p>
            <p className="text-gray-600">Carrier: <span className="font-bold">{status.carrier}</span></p>
          </div>
        )}
      </div>
    </div>
  )
}
