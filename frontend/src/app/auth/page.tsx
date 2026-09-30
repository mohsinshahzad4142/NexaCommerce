"use client";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      alert(`Logged in successfully as ${email}`);
    } else {
      alert(`Account registered successfully for ${name} (${email})`);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Redirecting to ${provider} Authentication...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Store Account"}
          </h1>
          <p className="text-xs text-gray-500">
            {isLogin ? "Enter your credentials to access your buyer dashboard & orders." : "Register to track orders, wishlist, and exclusive VIP rewards."}
          </p>
        </div>

        <div className="space-y-3">
          <button 
            type="button" 
            onClick={() => handleSocialLogin("Google")}
            className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="text-base">🌐</span> Continue with Google
          </button>
          <button 
            type="button" 
            onClick={() => handleSocialLogin("Facebook / Social")}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="text-base">👤</span> Continue with Social Login
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-[11px] font-extrabold text-gray-400 uppercase">Or with email</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                placeholder="Mohsin Shahzad" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500" 
                required 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
            <input 
              type="email" 
              placeholder="mohsin@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-sm"
          >
            {isLogin ? "Sign In to Store" : "Complete Registration"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}