"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  category: string
  description?: string
}

interface StoreContextType {
  cart: { product: Product; quantity: number }[]
  wishlist: Product[]
  recentlyViewed: Product[]
  compareList: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  toggleWishlist: (product: Product) => void
  addToRecentlyViewed: (product: Product) => void
  toggleCompare: (product: Product) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [compareList, setCompareList] = useState<Product[]>([])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => 
      prev.some(item => item.id === product.id) 
        ? prev.filter(item => item.id !== product.id) 
        : [...prev, product]
    )
  }

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id)
      return [product, ...filtered].slice(0, 6) // Keep last 6 viewed
    })
  }

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id)
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 products at a time.")
        return prev
      }
      return [...prev, product]
    })
  }

  return (
    <StoreContext.Provider value={{ cart, wishlist, recentlyViewed, compareList, addToCart, removeFromCart, toggleWishlist, addToRecentlyViewed, toggleCompare }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within a StoreProvider")
  return context
}
