"use client";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Shopping Cart 🛒</h1>
        <p className="text-xs text-gray-500 mt-1">Review your selected items before secure checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
          <p className="text-sm font-bold text-gray-600">Your cart is currently empty.</p>
          <Link href="/shop" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
            Start Shopping 🛍️
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-2xl" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.product.name}</h3>
                    <p className="text-xs text-indigo-600 font-black mt-1">Rs. {item.product.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-6 h-fit">
            <h3 className="text-sm font-extrabold text-gray-900 border-b pb-3">Order Summary</h3>
            <div className="flex justify-between text-xs font-medium text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-600">
              <span>Shipping Fee</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-3">
              <span>Total Amount</span>
              <span className="text-indigo-600">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
              Proceed to Secure Checkout ⚡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};