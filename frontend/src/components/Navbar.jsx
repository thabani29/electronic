import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

export default function Navbar(){
  const { cart } = useContext(CartContext)
  
  // Safe cart count calculation
  const count = cart.reduce((sum, item) => {
    const quantity = parseInt(item?.qty) || 0;
    return sum + quantity;
  }, 0);
  
  return (
    <nav className="nav">
      <div style={{fontWeight:700}}>Electronic Store</div>
      <div>
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> | <Link to="/cart">Cart ({count})</Link>
      </div>
    </nav>
  )
}