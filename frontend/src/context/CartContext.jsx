import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

const STORAGE_KEY = 'electronic_store_cart_v1'

// Helper function to safely parse cart items
const createSafeCartItem = (product) => {
  if (!product) return null;
  
  return {
    product_id: product?.product_id || product?.id || `temp_${Date.now()}`,
    name: product?.name || 'Unknown Product',
    price: parseFloat(product?.price) || 0,
    qty: parseInt(product?.qty) || 1,
    image: product?.image,
    // Include any other necessary fields
    ...product
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      
      const parsed = JSON.parse(raw)
      
      // Validate and clean stored cart data
      if (Array.isArray(parsed)) {
        return parsed.map(item => createSafeCartItem(item)).filter(Boolean)
      }
      
      return []
    } catch (e) {
      console.error('Error loading cart from storage:', e)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (e) { 
      console.error('Error saving cart to storage:', e)
    }
  }, [cart])

  function addToCart(product) {
    if (!product) {
      console.error('Attempted to add undefined product to cart')
      return
    }

    const safeProduct = createSafeCartItem(product)
    if (!safeProduct) return

    setCart(prev => {
      const found = prev.find(i => i.product_id === safeProduct.product_id)
      if (found) {
        return prev.map(i => 
          i.product_id === safeProduct.product_id 
            ? { ...i, qty: (parseInt(i.qty) || 0) + 1 }
            : i
        )
      }
      return [...prev, { ...safeProduct, qty: 1 }]
    })
  }

  function removeFromCart(product_id) {
    if (!product_id) {
      console.error('Attempted to remove item with undefined product_id')
      return
    }

    setCart(prev => prev.filter(i => i.product_id !== product_id))
  }

  function updateQty(product_id, qty) {
    if (!product_id) {
      console.error('Attempted to update quantity with undefined product_id')
      return
    }

    const safeQty = Math.max(1, parseInt(qty) || 1)
    
    setCart(prev => prev.map(i => 
      i.product_id === product_id 
        ? { ...i, qty: safeQty }
        : i
    ))
  }

  function clearCart() { 
    setCart([]) 
  }

  // Calculate total items in cart (for badge, etc.)
  const totalItems = cart.reduce((sum, item) => sum + (parseInt(item?.qty) || 0), 0)

  // Calculate total price - SAFE VERSION
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item?.price) || 0;
    const quantity = parseInt(item?.qty) || 0;
    return sum + (price * quantity);
  }, 0).toFixed(2);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalItems,
    totalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}