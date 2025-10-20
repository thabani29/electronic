import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function Cart(){
  const { cart, clearCart } = useContext(CartContext)
  const total = cart.reduce((s,i) => s + (i.price * i.qty), 0).toFixed(2)

  return (
    <div style={{padding:12}}>
      <h3>Cart</h3>
      {cart.length === 0 ? <p>No items</p> : (
        <div>
          {cart.map(item => (
            <div key={item.product_id} style={{marginBottom:8}}>
              {item.name} x {item.qty} — ${ (item.price * item.qty).toFixed(2) }
            </div>
          ))}
          <div style={{fontWeight:700}}>Total: ${total}</div>
          <button className="button" onClick={clearCart}>Clear</button>
        </div>
      )}
    </div>
  )
}
