"use client";
import Link from "next/link";

const CATEGORIES = [
  { name: "Fashion & Apparel", count: "1,240 Items", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80", slug: "Fashion" },
  { name: "Electronics & Gadgets", count: "850 Items", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80", slug: "Electronics" },
  { name: "Home & Kitchen", count: "620 Items", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", slug: "Home & Kitchen" },
  { name: "Beauty & Skincare", count: "410 Items", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", slug: "Beauty" },
  { name: "Sports & Fitness", count: "290 Items", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80", slug: "Sports" },
  { name: "Books & Literature", count: "980 Items", image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80", slug: "Books" },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Explore Categories 🏷️</h1>
        <p className="text-xs text-gray-500 mt-1">Browse through our curated departments engineered for maximum discovery.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((c, i) => (
          <Link key={i} href="/shop" className="group relative h-64 rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex items-end p-6">
            <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="relative z-10 space-y-1">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur rounded-lg text-[10px] font-extrabold text-white">
                {c.count}
              </span>
              <h3 className="text-lg font-black text-white">{c.name}</h3>
              <p className="text-xs text-gray-300 font-medium">Explore collection →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};