import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Cart(){
  const { cart, removeFromCart, updateQty, clearCart } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const total = cart.reduce((s,i) => s + (i.price * i.qty), 0).toFixed(2)

  async function handleCheckout(){
    if(cart.length === 0) {
      setMessage({type:'error', text:'Cart is empty'})
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user_id: null, total: parseFloat(total), items: cart })
      })
      const data = await res.json()
      if(res.ok){
        setMessage({type:'success', text:`Order placed! Order ID: ${data.orderId || 'N/A'}`})
        clearCart()
      } else {
        setMessage({type:'error', text: data.error || 'Checkout failed'})
      }
    } catch (err){
      console.error(err)
      setMessage({type:'error', text:'Network or server error'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Your Cart</h2>
      {message && (
        <div style={{marginBottom:12, padding:10, borderRadius:8, background: message.type === 'success' ? '#ddffef' : '#ffecec' }}>
          {message.text}
        </div>
      )}
      {cart.length === 0 ? <p>No items in cart.</p> : (
        <div>
          {cart.map(item => (
            <div key={item.product_id} style={{display:'flex', gap:12, alignItems:'center', marginBottom:12, background:'white', padding:12, borderRadius:8}}>
              <img src={item.image} alt={item.name} style={{width:80, height:60, objectFit:'cover', borderRadius:6}} />
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>{item.name}</div>
                <div>${item.price} each</div>
                <div style={{marginTop:6}}>
                  Qty: <input type="number" value={item.qty} min={1} onChange={(e)=> updateQty(item.product_id, parseInt(e.target.value || '1'))} style={{width:60}} />
                  <button onClick={()=> removeFromCart(item.product_id)} style={{marginLeft:12}} className="button">Remove</button>
                </div>
              </div>
              <div style={{fontWeight:700}}>${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
          <div style={{marginTop:12, fontWeight:800}}>Total: ${total}</div>
          <div style={{marginTop:12}}>
            <button className="button" onClick={handleCheckout} disabled={loading}>{loading ? 'Processing...' : 'Checkout'}</button>
            <button className="button" onClick={clearCart} style={{marginLeft:10, background:'#ef4444'}}>Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  )
}
