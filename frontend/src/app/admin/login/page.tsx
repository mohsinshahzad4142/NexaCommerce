"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@nexacommerce.com");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@nexacommerce.com" && password.length > 5) {
      // Successful mock admin login
      router.push("/admin/products");
    } else {
      setError("Invalid admin credentials. Use admin@nexacommerce.com");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="text-2xl font-extrabold text-indigo-600">NexaAdmin Portal</div>
          <p className="text-xs text-gray-500">Secure Restricted Access for Store Management</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            Authenticate & Login
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}