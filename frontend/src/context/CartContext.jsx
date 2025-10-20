import React, { createContext, useState, useEffect } from 'react'
export const CartContext = createContext()

const STORAGE_KEY = 'electronic_store_cart_v1'

export function CartProvider({children}){
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (e) { /* ignore write errors */ }
  }, [cart])

  function addToCart(product){
    setCart(prev => {
      const found = prev.find(i => i.product_id === product.product_id)
      if(found) return prev.map(i => i.product_id === product.product_id ? {...i, qty: i.qty + 1} : i)
      return [...prev, {...product, qty:1}]
    })
  }

  function removeFromCart(product_id){
    setCart(prev => prev.filter(i => i.product_id !== product_id))
  }

  function updateQty(product_id, qty){
    setCart(prev => prev.map(i => i.product_id === product_id ? {...i, qty: Math.max(1, qty)} : i))
  }

  function clearCart(){ setCart([]) }

  return (
    <CartContext.Provider value={{cart, addToCart, removeFromCart, updateQty, clearCart}}>
      {children}
    </CartContext.Provider>
  )
}
