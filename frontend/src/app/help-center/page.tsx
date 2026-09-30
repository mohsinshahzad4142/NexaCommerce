export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Help Center ❓</h1>
        <p className="text-xs text-gray-500">Frequently asked questions and guides to help you shop seamlessly.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <h3 className="text-xs font-bold text-gray-900">How do I place an order?</h3>
            <p className="text-xs text-gray-600">Browse products, click Add to Cart, go to your cart, and proceed to checkout.</p>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <h3 className="text-xs font-bold text-gray-900">What payment methods are supported?</h3>
            <p className="text-xs text-gray-600">We support Cash on Delivery (COD), Credit/Debit Cards, and Bank Transfers.</p>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <h3 className="text-xs font-bold text-gray-900">How can I modify or cancel my order?</h3>
            <p className="text-xs text-gray-600">You can cancel your order within 2 hours of placement through customer service.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
