import React, { useEffect, useState, useContext } from "react"; 
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { getApiUrl } from "../utils/api";

const fallbackProducts = [
  {
    product_id: 1,
    name: "MacBook Pro 14\"",
    price: 1999.99,
    description: "Apple MacBook Pro with M3 chip",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='140' viewBox='0 0 220 140'%3E%3Crect width='220' height='140' fill='%23e5e7eb'/%3E%3Crect x='40' y='30' width='140' height='80' rx='8' fill='%23333'/%3E%3Crect x='50' y='40' width='120' height='60' fill='%23555'/%3E%3Ctext x='110' y='120' font-family='Arial' font-size='12' text-anchor='middle' fill='%236b7280'%3ELaptop%3C/text%3E%3C/svg%3E"
  },
  {
    product_id: 2, 
    name: "Wireless Mouse",
    price: 29.99,
    description: "Ergonomic wireless mouse",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='140' viewBox='0 0 220 140'%3E%3Crect width='220' height='140' fill='%23e5e7eb'/%3E%3Cellipse cx='110' cy='70' rx='50' ry='30' fill='%23333'/%3E%3Ctext x='110' y='120' font-family='Arial' font-size='12' text-anchor='middle' fill='%236b7280'%3EMouse%3C/text%3E%3C/svg%3E"
  }
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const API = getApiUrl();

  console.log('🛒 Products Component - API:', API);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching products from:', `${API}/api/products`);
        
        const response = await fetch(`${API}/api/products`);
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        
        const text = await response.text();
        console.log('📄 Response length:', text.length);
        
        if (!text) {
          throw new Error('Empty response from server');
        }
        
        const data = JSON.parse(text);
        console.log(`✅ Success! Loaded ${data.length} products:`, data);
        
        if (isMounted) {
          setProducts(data);
        }
        
      } catch (error) {
        console.error('❌ Failed to load products:', error);
        if (isMounted) {
          setProducts(fallbackProducts);
          setError(`Connection issue: ${error.message}. Using demo products.`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => { isMounted = false; };
  }, [API]);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Products</h2>
        <p style={{ marginTop: 40 }}>Loading products...</p>
        <div style={{ 
          color: "#666", 
          fontSize: "0.9em", 
          marginTop: 10,
          background: "#f3f4f6",
          padding: "8px 12px",
          borderRadius: "6px",
          display: "inline-block"
        }}>
          🔗 Connecting to: {API}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Products ({products.length})</h2>
      
      {error && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20
      }}>
        {products.map((p) => (
          <ProductCard 
            key={p.product_id} 
            product={p} 
            onAdd={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}