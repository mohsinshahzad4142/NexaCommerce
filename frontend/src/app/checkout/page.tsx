"use client";
import { useState } from "react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import Link from "next/link";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "Mohsin Shahzad",
    email: "mohsin@example.com",
    address: "Main Boulevard, DHA Phase 6",
    city: "Lahore",
    postalCode: "54000",
    paymentMethod: "cod"
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto">
              ✓
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
            <p className="text-gray-600 text-sm">
              Thank you for your purchase, <span className="font-semibold text-gray-900">{formData.fullName}</span>. Your order is being processed and will be shipped to <span className="font-semibold text-gray-900">{formData.city}</span> soon.
            </p>
            <div className="pt-4">
              <Link href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                Back to Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Shipping Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Street Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Postal Code</label>
                  <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-indigo-600 bg-indigo-50/50 rounded-xl cursor-pointer">
                  <input type="radio" name="paymentMethod" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
                  <span className="font-semibold text-sm text-gray-900">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="paymentMethod" className="text-indigo-600 focus:ring-indigo-500" />
                  <span className="font-semibold text-sm text-gray-700">Credit / Debit Card (Stripe Mock)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-gray-900 border-b pb-3">Order Total</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">$597.00</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount (NEXA20)</span>
                <span className="font-semibold">-$119.40</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>$477.60</span>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-100 text-center"
              >
                Place Order Now
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}