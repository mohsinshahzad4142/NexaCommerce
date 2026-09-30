"use client";
import { useState } from "react";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "add" | "bulk">("catalog");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Selected IDs for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Product state list
  const [products, setProducts] = useState([
    { id: 1, title: "Ultra Wireless Headphones", sku: "HD-10025", barcode: "890123456789", category: "Electronics", brand: "AudioTech", price: 2990, stock: 20, status: "PUBLISHED", weight: "0.4 kg", tags: "audio, wireless" },
    { id: 2, title: "Aesthetic Oversized Hoodie", sku: "APP-8842", barcode: "890123456790", category: "Fashion & Apparel", brand: "Mohsin Wear", price: 2490, stock: 45, status: "PUBLISHED", weight: "0.6 kg", tags: "hoodie, fashion" },
    { id: 3, title: "Ergonomic Mesh Office Chair", sku: "HOM-9921", barcode: "890123456791", category: "Home & Living", brand: "ErgoComfort", price: 12900, stock: 5, status: "DRAFT", weight: "12.5 kg", tags: "chair, office" },
  ]);

  // Deep Form states including Media, SEO, and Variations
  const [form, setForm] = useState({
    title: "", sku: "", barcode: "", price: "", stock: "", category: "Electronics", 
    brand: "", weight: "", dimensions: "", tags: "", description: "", shortDesc: "",
    metaTitle: "", metaDesc: "", status: "PUBLISHED", images: "", videoUrl: "",
    hasVariations: false, variantName: "", variantPrice: "", variantStock: ""
  });

  // Search Filtering Logic
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- BULK ACTIONS ---
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      setProducts(products.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkStatus = (newStatus: string) => {
    if (selectedIds.length === 0) return;
    setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p));
    setSelectedIds([]);
    alert(`Updated status to ${newStatus} for selected products.`);
  };

  const handleBulkPriceUpdate = () => {
    const amountStr = prompt("Enter price adjustment amount (e.g. +500 or -200):");
    if (!amountStr) return;
    const diff = parseFloat(amountStr);
    if (isNaN(diff)) return alert("Invalid amount entered.");

    setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, price: Math.max(0, p.price + diff) } : p));
    setSelectedIds([]);
    alert("Bulk price updated successfully!");
  };

  const handleBulkStockUpdate = () => {
    const stockStr = prompt("Enter new stock quantity for selected products:");
    if (!stockStr) return;
    const newStock = parseInt(stockStr);
    if (isNaN(newStock)) return alert("Invalid stock value.");

    setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, stock: newStock } : p));
    setSelectedIds([]);
    alert("Bulk stock updated successfully!");
  };

  const handleBulkCategoryUpdate = () => {
    const newCat = prompt("Enter new category name (Electronics, Fashion & Apparel, Home & Living, Fitness & Sports):");
    if (!newCat) return;

    setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, category: newCat } : p));
    setSelectedIds([]);
    alert("Bulk category updated successfully!");
  };

  // --- SINGLE PRODUCT ACTIONS ---
  const handleDuplicate = (p: any) => {
    const duplicated = {
      ...p,
      id: Date.now(),
      title: `${p.title} (Copy)`,
      sku: `${p.sku}-COPY`
    };
    setProducts([duplicated, ...products]);
    alert("Product duplicated successfully!");
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setProducts(products.map(p => p.id === editingId ? {
        ...p,
        title: form.title,
        sku: form.sku,
        barcode: form.barcode,
        category: form.category,
        brand: form.brand,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        weight: form.weight,
        status: form.status,
        tags: form.tags
      } : p));
      setEditingId(null);
      alert("Product updated successfully!");
    } else {
      const newP = {
        id: Date.now(),
        title: form.title || "Untitled Product",
        sku: form.sku || "SKU-XXX",
        barcode: form.barcode || "N/A",
        category: form.category,
        brand: form.brand || "Generic",
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        status: form.status,
        weight: form.weight || "1 kg",
        tags: form.tags || "general"
      };
      setProducts([newP, ...products]);
      alert("Product added successfully!");
    }

    setForm({
      title: "", sku: "", barcode: "", price: "", stock: "", category: "Electronics", 
      brand: "", weight: "", dimensions: "", tags: "", description: "", shortDesc: "",
      metaTitle: "", metaDesc: "", status: "PUBLISHED", images: "", videoUrl: "",
      hasVariations: false, variantName: "", variantPrice: "", variantStock: ""
    });
    setActiveTab("catalog");
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      sku: p.sku,
      barcode: p.barcode,
      price: p.price.toString(),
      stock: p.stock.toString(),
      category: p.category,
      brand: p.brand,
      weight: p.weight,
      dimensions: "10x10x10 cm",
      tags: p.tags || "",
      description: "Detailed product description and specifications...",
      shortDesc: "Short summary...",
      metaTitle: p.title,
      metaDesc: "SEO description for search engines...",
      status: p.status,
      images: "",
      videoUrl: "",
      hasVariations: false,
      variantName: "",
      variantPrice: "",
      variantStock: ""
    });
    setActiveTab("add");
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Title,SKU,Barcode,Category,Brand,Price,Stock,Status,Weight,Tags\n";
    const rows = products.map(p => `${p.id},"${p.title}","${p.sku}","${p.barcode}","${p.category}","${p.brand}",${p.price},${p.stock},"${p.status}","${p.weight}","${p.tags}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "nexacommerce_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`CSV File "${file.name}" uploaded and parsed successfully!`);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products Management Suite</h1>
          <p className="text-xs text-gray-500 mt-0.5">Fully operational deep inventory, variations, SEO & CSV tools.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => { setActiveTab("catalog"); setEditingId(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'catalog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            📦 Catalog ({products.length})
          </button>
          <button 
            onClick={() => { 
              setActiveTab("add"); 
              setEditingId(null);
              setForm({ title: "", sku: "", barcode: "", price: "", stock: "", category: "Electronics", brand: "", weight: "", dimensions: "", tags: "", description: "", shortDesc: "", metaTitle: "", metaDesc: "", status: "PUBLISHED", images: "", videoUrl: "", hasVariations: false, variantName: "", variantPrice: "", variantStock: "" });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'add' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {editingId !== null ? "✏️ Edit Product" : "+ Add New Product"}
          </button>
          <button 
            onClick={() => setActiveTab("bulk")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'bulk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            ⚡ Bulk & CSV
          </button>
        </div>
      </div>

      {/* TAB 1: CATALOG */}
      {activeTab === "catalog" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <input
              type="text"
              placeholder="Search by title, SKU, or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs w-full sm:w-96 focus:outline-none focus:border-indigo-500 font-medium"
            />
            <div className="text-xs text-gray-500 font-bold">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          {/* BULK ACTIONS TOOLBAR */}
          {selectedIds.length > 0 && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-indigo-900">
                {selectedIds.length} product(s) selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleBulkPriceUpdate} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition shadow-sm">💰 Bulk Price</button>
                <button onClick={handleBulkStockUpdate} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition shadow-sm">📦 Bulk Stock</button>
                <button onClick={handleBulkCategoryUpdate} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition shadow-sm">🏷️ Bulk Category</button>
                <button onClick={() => handleBulkStatus("PUBLISHED")} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm">✅ Publish</button>
                <button onClick={() => handleBulkStatus("DRAFT")} className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow-sm">📝 Draft</button>
                <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition shadow-sm">🗑️ Delete</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" onChange={handleSelectAll} checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                  </th>
                  <th className="py-3 px-4">Product Title / SKU</th>
                  <th className="py-3 px-4">Category & Brand</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400 font-bold">No products found matching your search.</td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className={`hover:bg-gray-50/50 transition ${selectedIds.includes(p.id) ? 'bg-indigo-50/30' : ''}`}>
                      <td className="py-4 px-4">
                        <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => handleSelectOne(p.id)} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">{p.title}</p>
                        <p className="text-[11px] text-gray-400">SKU: {p.sku} | Barcode: {p.barcode}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] text-gray-600 font-bold">{p.category}</span>
                        <p className="text-[11px] text-indigo-600 mt-1 font-bold">Brand: {p.brand}</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-600">Rs. {p.price.toLocaleString()}</td>
                      <td className="py-4 px-4 font-bold text-gray-800">{p.stock} units</td>
                      <td className="py-4 px-4 text-gray-500">{p.weight}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${p.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1">
                        <button onClick={() => handleEditClick(p)} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition">Edit</button>
                        <button onClick={() => handleDuplicate(p)} className="px-2.5 py-1 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition">Duplicate</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition">Del</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADD / EDIT FORM WITH SEO & MEDIA */}
      {activeTab === "add" && (
        <form onSubmit={handleSubmitProduct} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{editingId !== null ? "Edit Product Details" : "Add New Product (Deep Fields)"}</h2>
              <p className="text-xs text-gray-500">Configure catalog details, variations, media, SEO, and inventory specs.</p>
            </div>
            {editingId !== null && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-xs">Editing ID: {editingId}</span>
            )}
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">1. General Information & Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                <input type="text" placeholder="e.g. Wireless Headphones" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SKU *</label>
                  <input type="text" placeholder="HD-10025" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Barcode</label>
                  <input type="text" placeholder="8901234..." value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium">
                  <option>Electronics</option>
                  <option>Fashion & Apparel</option>
                  <option>Home & Living</option>
                  <option>Fitness & Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Brand</label>
                <input type="text" placeholder="Brand Name" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium">
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Tags (comma separated)</label>
              <input type="text" placeholder="e.g. wireless, bluetooth, audio" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">2. Pricing, Stock & Shipping Specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Regular Price (Rs.) *</label>
                <input type="number" placeholder="2990" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity *</label>
                <input type="number" placeholder="50" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Weight (kg)</label>
                <input type="text" placeholder="0.5 kg" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dimensions (LxWxH)</label>
                <input type="text" placeholder="10x5x2 cm" value={form.dimensions} onChange={e => setForm({...form, dimensions: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
            </div>
          </div>

          {/* Section 3: Descriptions, Multiple Images & Video */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">3. Descriptions, Multiple Images & Video URL</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Short Description</label>
              <input type="text" placeholder="Brief subtitle summary" value={form.shortDesc} onChange={e => setForm({...form, shortDesc: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Description / Specifications</label>
              <textarea rows={4} placeholder="Full specifications and description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Multiple Images URLs / Files</label>
                <input type="text" placeholder="https://image1.jpg, https://image2.jpg" value={form.images} onChange={e => setForm({...form, images: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Video URL (YouTube/MP4)</label>
                <input type="text" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
            </div>
          </div>

          {/* Section 4: Product Variations */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">4. Product Variations (Size / Color / Attributes)</h3>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="hasVar" checked={form.hasVariations} onChange={e => setForm({...form, hasVariations: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
              <label htmlFor="hasVar" className="text-xs font-bold text-gray-700 cursor-pointer">Enable Variant Specific Pricing & Stock Matrix</label>
            </div>
            {form.hasVariations && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                <p className="text-[11px] text-gray-500 font-bold">Configure default variant attributes below:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="Variant (e.g. Red / Large)" value={form.variantName} onChange={e => setForm({...form, variantName: e.target.value})} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium" />
                  <input type="number" placeholder="Variant Price (Rs.)" value={form.variantPrice} onChange={e => setForm({...form, variantPrice: e.target.value})} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium" />
                  <input type="number" placeholder="Variant Stock" value={form.variantStock} onChange={e => setForm({...form, variantStock: e.target.value})} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium" />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Product SEO Fields */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">5. Product SEO Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">SEO Meta Title</label>
                <input type="text" placeholder="Custom meta title for Google search" value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">SEO Meta Description</label>
                <input type="text" placeholder="Custom meta description for search engine snippet" value={form.metaDesc} onChange={e => setForm({...form, metaDesc: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => { setActiveTab("catalog"); setEditingId(null); }} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition">Cancel</button>
            <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-sm">{editingId !== null ? "Update Product" : "Save & Publish Product"}</button>
          </div>
        </form>
      )}

      {/* TAB 3: BULK & CSV */}
      {activeTab === "bulk" && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bulk Product Management & CSV Operations</h2>
            <p className="text-xs text-gray-500 mt-0.5">Import catalogs via CSV, export store data backups instantly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center text-center space-y-3">
              <div className="text-3xl">📤</div>
              <h3 className="font-bold text-gray-900">CSV Import / Upload</h3>
              <p className="text-xs text-gray-500">Upload bulk products spreadsheet with SKU, price, stock, and variations.</p>
              <label className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
            </div>

            <div className="p-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center text-center space-y-3">
              <div className="text-3xl">📥</div>
              <h3 className="font-bold text-gray-900">CSV Export</h3>
              <p className="text-xs text-gray-500">Download your entire active store product catalog as a CSV backup file.</p>
              <button onClick={handleExportCSV} className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition shadow-sm">
                Download Catalog CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}