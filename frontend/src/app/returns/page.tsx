export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Returns & Refunds Policy 📄</h1>
        <p className="text-xs text-gray-500">We offer a hassle-free 7-day return policy for all eligible products.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900">1. Eligibility for Returns</h3>
          <p>Items must be unused, in their original packaging, and accompanied by the receipt or proof of purchase.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900">2. Refund Process</h3>
          <p>Once your returned item is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 3-5 business days.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900">3. Non-Returnable Items</h3>
          <p>Certain goods such as perishable items, custom-made products, and intimate apparel cannot be returned.</p>
        </div>
      </div>
    </div>
  )
}
