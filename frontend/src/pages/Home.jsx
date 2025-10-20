import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Home(){
  const [featured, setFeatured] = useState([])
  const { addToCart } = useContext(CartContext)

  useEffect(()=>{
    fetch(`${API}/api/products`)
      .then(r=>r.json())
      .then(data=> setFeatured(data.slice(0,3)))
      .catch(console.error)
  }, [])

  return (
    <div>
      <section style={{display:'flex', gap:20, alignItems:'center', background:'white', padding:24, borderRadius:12}}>
        <div style={{flex:1}}>
          <h1 style={{fontSize:32}}>Electronics made simple</h1>
          <p style={{color:'#475569'}}>Clean, reliable and affordable devices for students and IT enthusiasts. Discover laptops, accessories and more.</p>
          <div style={{marginTop:16}}>
            <Link to="/products" className="button">Shop Now</Link>
          </div>
        </div>
        <div style={{width:360}}>
          <img src="https://via.placeholder.com/600x360?text=Electronics+Banner" alt="banner" style={{width:'100%', borderRadius:8}} />
        </div>
      </section>

      <section style={{marginTop:24}}>
        <h2>Featured</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginTop:12}}>
          {featured.map(p => (
            <div key={p.product_id} style={{background:'white', padding:12, borderRadius:8}}>
              <img src={p.image} alt={p.name} style={{width:'100%', height:140, objectFit:'cover', borderRadius:6}} />
              <div style={{fontWeight:700, marginTop:8}}>{p.name}</div>
              <div style={{marginTop:6}}>${p.price}</div>
              <div style={{marginTop:8}}>
                <button className="button" onClick={()=> addToCart(p)}>Add to Cart</button>
                <Link to="/products" style={{marginLeft:8}}>View all</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
