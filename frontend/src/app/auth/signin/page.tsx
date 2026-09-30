"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setSuccess(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-gray-900">Welcome Back 👋</h1>
          <p className="text-xs text-gray-500">Sign in to access your orders, wishlist, and exclusive discounts.</p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 text-center">
            Sign in successful! Redirecting to storefront... 🚀
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="e.g. mohsin@nexacommerce.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Sign In ⚡
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-500 pt-2">
          Don't have an account? <Link href="/shop" className="text-indigo-600 font-bold hover:underline">Register now</Link>
        </div>
      </div>
    </div>
  );
};