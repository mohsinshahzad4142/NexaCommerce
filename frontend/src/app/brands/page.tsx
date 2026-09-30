"use client";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import Link from "next/link";

export default function BrandsPage() {
  const brands = [
    { id: "sony", name: "Sony", logo: "🎧", itemsCount: 12, description: "World-class audio and electronics." },
    { id: "apple", name: "Apple", logo: "📱", itemsCount: 24, description: "Innovative technology and smart devices." },
    { id: "samsung", name: "Samsung", logo: "📺", itemsCount: 18, description: "Leading displays and mobile tech." },
    { id: "nike", name: "Nike", logo: "👟", itemsCount: 30, description: "Sportswear and athletic footwear." },
    { id: "gucci", name: "Gucci", logo: "👜", itemsCount: 8, description: "Luxury fashion and lifestyle accessories." },
    { id: "canon", name: "Canon", logo: "📸", itemsCount: 10, description: "Professional cameras and optical products." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Featured Brands</h1>
          <p className="text-sm text-gray-500 mt-1">Browse products from your favorite world-renowned brands.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              href={`/products?brand=${brand.id}`}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center gap-5 group"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition">
                {brand.logo}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition">{brand.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{brand.description}</p>
                <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mt-2">
                  {brand.itemsCount} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}