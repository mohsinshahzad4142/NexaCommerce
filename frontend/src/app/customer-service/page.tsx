export default function CustomerServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Customer Service 💬</h1>
        <p className="text-xs text-gray-500">We are here to help you 24/7 with any queries or support you need.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-gray-900">Email Support</h3>
            <p className="text-xs text-gray-600">support@nexacommerce.com</p>
            <p className="text-[10px] text-emerald-600 font-bold">Average reply time: 2 hours</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-gray-900">Helpline</h3>
            <p className="text-xs text-gray-600">+92 300 1234567</p>
            <p className="text-[10px] text-emerald-600 font-bold">Mon - Sat (9am - 6pm)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
