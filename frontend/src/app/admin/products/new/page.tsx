"use client";
import { useState } from "react";
import Link from "next/link";

export default function AddProductPage() {
  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState("published");
  const [scheduleDate, setScheduleDate] = useState("");
  
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [tags, setTags] = useState("");

  const [productType, setProductType] = useState<"simple" | "variable">("variable");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");

  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // SEO States
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoSlug, setSeoSlug] = useState("");

  // Dynamic Specifications & Gallery
  const [specs, setSpecs] = useState([{ key: "Material", value: "Aluminum" }, { key: "Warranty", value: "1 Year" }]);
  const [gallery, setGallery] = useState([""]);

  // Product Variations (Variable Product Matrix)
  const [variants, setVariants] = useState([
    { id: 1, name: "Matte Black / Small", sku: "HD-BLK-S", price: "299", stock: "12", image: "" },
    { id: 2, name: "Matte Black / Large", sku: "HD-BLK-L", price: "319", stock: "8", image: "" },
    { id: 3, name: "Arctic White / Small", sku: "HD-WHT-S", price: "299", stock: "15", image: "" },
  ]);

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: "", sku: "", price: "", stock: "", image: "" }]);
  };

  const updateVariant = (id: number, field: string, val: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: val } : v));
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const addSpecRow = () => setSpecs([...specs, { key: "", value: "" }]);
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const addGalleryInput = () => setGallery([...gallery, ""]);
  const updateGallery = (index: number, val: string) => {
    const updated = [...gallery];
    updated[index] = val;
    setGallery(updated);
  };

  const [savedMsg, setSavedMsg] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-xl font-extrabold tracking-tight text-indigo-400">NexaAdmin</div>
          <nav className="space-y-2 text-sm">
            <Link href="/admin/products" className="block px-3 py-2 rounded-xl bg-indigo-600 font-semibold">Products</Link>
            <Link href="/admin/orders" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300">Orders</Link>
            <Link href="/admin/customers" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300">Customers</Link>
            <Link href="/admin/analytics" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300">Analytics</Link>
            <Link href="/admin/settings" className="block px-3 py-2 rounded-xl hover:bg-gray-800 text-gray-300">Settings</Link>
          </nav>
        </div>
        <Link href="/products" className="text-xs text-gray-400 hover:text-white">← Back to Storefront</Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-500 mt-1">Configure advanced product variants, SEO settings, pricing, and media assets.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="px-4 py-2 border rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50">Cancel</Link>
            <button onClick={handleSubmit} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm transition">Save Product</button>
          </div>
        </div>

        {savedMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold shadow-sm">
            Product saved successfully with SEO meta fields!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: General & Publishing */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-3">Basic Info & Publishing Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Product Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Ultra Wireless Headphones"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">URL Slug</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="e.g. ultra-wireless-headphones"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Product Type</label>
                <select 
                  value={productType} 
                  onChange={(e) => setProductType(e.target.value as "simple" | "variable")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-indigo-600 focus:outline-none"
                >
                  <option value="variable">Variable Product (Options)</option>
                  <option value="simple">Simple Product</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Publish Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Product SKU</label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-10025" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-mono" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Barcode (UPC/EAN)</label>
                <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="0793573182" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-mono" />
              </div>
            </div>
          </div>

          {/* Section 2: Product Variations Matrix */}
          {productType === "variable" && (
            <div className="bg-white p-8 rounded-3xl border border-indigo-200 shadow-sm space-y-6 bg-gradient-to-b from-indigo-50/20 to-white">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Product Variations Matrix</h3>
                  <p className="text-xs text-gray-500">Configure variant-specific attributes, pricing, stock, SKU, and images.</p>
                </div>
                <button type="button" onClick={addVariant} className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-700 transition">
                  + Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((v) => (
                  <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Variant Name (e.g. Red / XL)</label>
                      <input type="text" value={v.name} onChange={(e) => updateVariant(v.id, 'name', e.target.value)} placeholder="Color / Size" className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-xs font-semibold" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Variant SKU</label>
                      <input type="text" value={v.sku} onChange={(e) => updateVariant(v.id, 'sku', e.target.value)} placeholder="SKU-RED-S" className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-xs font-mono" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Price ($)</label>
                      <input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', e.target.value)} placeholder="299.00" className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-xs font-bold text-emerald-600" />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Stock</label>
                      <input type="number" value={v.stock} onChange={(e) => updateVariant(v.id, 'stock', e.target.value)} placeholder="10" className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-xs font-bold" />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Variant Image URL</label>
                      <input type="url" value={v.image} onChange={(e) => updateVariant(v.id, 'image', e.target.value)} placeholder="https://img.com/variant.jpg" className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-xs" />
                    </div>

                    <div className="md:col-span-1 flex justify-end pt-4">
                      <button type="button" onClick={() => removeVariant(v.id)} className="text-red-500 hover:text-red-700 p-2 text-xs font-bold">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Pricing & Logistics */}
          {productType === "simple" && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-gray-900 border-b pb-3">Pricing & Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Regular Price ($)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="299.00" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Sale Price ($)</label>
                  <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="249.00" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Weight (kg)</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.45 kg" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Dimensions</label>
                  <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="10 x 5 x 15 cm" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Taxonomies & Branding */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-3">Taxonomies (Brand, Category & Tags)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Brand</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Sony, Nike" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm">
                  <option>Electronics</option>
                  <option>Fashion & Apparel</option>
                  <option>Home & Living</option>
                  <option>Fitness & Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Tags</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="wireless, audio, bluetooth" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
              </div>
            </div>
          </div>

          {/* Section 5: Product SEO & Meta Fields */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="border-b pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Product SEO & Meta Fields</h3>
                <p className="text-xs text-gray-500">Optimize how this product appears in search engine results and social shares.</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-xl">SEO Optimized</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    value={metaTitle} 
                    onChange={(e) => setMetaTitle(e.target.value)} 
                    placeholder="Custom title for Google search..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Recommended: 50-60 characters</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Meta Description</label>
                  <textarea 
                    rows={3}
                    value={metaDescription} 
                    onChange={(e) => setMetaDescription(e.target.value)} 
                    placeholder="Summary of product for search engine snippet..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  ></textarea>
                  <span className="text-[10px] text-gray-400 mt-1 block">Recommended: 150-160 characters</span>
                </div>
              </div>

              {/* Google Search Preview Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Google Search Preview</span>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                    <div className="text-xs text-gray-600 font-mono">https://nexacommerce.com/products/{seoSlug || slug || "product-url"}</div>
                    <div className="text-sm font-medium text-blue-700 truncate">
                      {metaTitle || title || "Product Title Preview will appear here..."}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {metaDescription || shortDesc || "Please enter a meta description or short description to see how it looks in Google search results snippet..."}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Custom SEO URL Slug</label>
                  <input 
                    type="text" 
                    value={seoSlug} 
                    onChange={(e) => setSeoSlug(e.target.value)} 
                    placeholder="custom-url-slug"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Descriptions & Media */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-3">Descriptions & Media</h3>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Short Description</label>
              <textarea rows={2} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Brief summary..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Detailed Description</label>
              <textarea rows={4} value={longDesc} onChange={(e) => setLongDesc(e.target.value)} placeholder="Full store description..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Product Video URL</label>
                <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Gallery Image URLs</label>
                <div className="space-y-2">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="url" value={url} onChange={(e) => updateGallery(idx, e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" />
                    </div>
                  ))}
                  <button type="button" onClick={addGalleryInput} className="text-xs font-bold text-indigo-600 hover:underline">+ Add another image</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Custom Specifications */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">Custom Specifications</h3>
              <button type="button" onClick={addSpecRow} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl">+ Add Spec</button>
            </div>
            <div className="space-y-3">
              {specs.log ? null : specs.map((spec, idx) => (
                <div key={idx} className="flex gap-4">
                  <input type="text" value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} placeholder="Attribute Name (e.g. Color)" className="flex-1 bg-gray-50 border rounded-xl px-4 py-2.5 text-sm" />
                  <input type="text" value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} placeholder="Attribute Value (e.g. Matte Black)" className="flex-1 bg-gray-50 border rounded-xl px-4 py-2.5 text-sm" />
                </div>
              ))}
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}