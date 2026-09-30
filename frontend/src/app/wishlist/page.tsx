"use client";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">My Saved Wishlist ❤️</h1>
        <p className="text-xs text-gray-500 mt-1">Your favorite items bookmarked for quick access.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
          <p className="text-sm font-bold text-gray-600">Your wishlist is empty.</p>
          <Link href="/shop" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
            Explore Products 🛍️
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map(p => (
            <div key={p.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group">
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition shadow"
                >
                  ❤️
                </button>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</h3>
                  <span className="text-sm font-black text-indigo-600 mt-1 block">Rs. {p.price.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => { addToCart(p); toggleWishlist(p); }}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-extrabold transition"
                >
                  Move to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};