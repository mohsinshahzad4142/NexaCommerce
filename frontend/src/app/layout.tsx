import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/context/StoreContext"
import HeaderNav from "@/components/HeaderNav"
import CompareBar from "@/components/CompareBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NexaCommerce - Quality Products & Unbeatable Prices",
  description: "Discover quality products with real-time stock updates and secure checkout.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <StoreProvider>
          <HeaderNav />
          <main className="flex-grow">{children}</main>
          <CompareBar />
          <footer className="bg-white border-t border-gray-200 py-10 mt-20">
            <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500 space-y-2">
              <p className="font-bold text-gray-800">© 2026 NexaCommerce. All rights reserved.</p>
              <p>Built with Next.js & Tailwind CSS.</p>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
