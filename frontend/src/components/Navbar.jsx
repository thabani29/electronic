import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

export default function Navbar(){
  const { cart } = useContext(CartContext)
  const count = cart.reduce((s,i) => s + (i.qty || 0), 0)
  return (
    <nav className="nav">
      <div style={{fontWeight:700}}>Electronic Store</div>
      <div>
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> | <Link to="/cart">Cart ({count})</Link>
      </div>
    </nav>
  )
}
