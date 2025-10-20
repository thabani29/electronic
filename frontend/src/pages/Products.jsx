import React, { useEffect, useState, useContext } from 'react'
import ProductCard from '../components/ProductCard'
import { CartContext } from '../context/CartContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Products(){
  const [products, setProducts] = useState([])
  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error)
  }, [])

  return (
    <div>
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.product_id} product={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  )
}
