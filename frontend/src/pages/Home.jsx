import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getImageUrl } from "../utils/api";

// Use the Render URL directly
const API = "https://electronic-vzq5.onrender.com";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  console.log('🏠 Home Component - Using API:', API);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching featured products...');
        
        const response = await fetch(`${API}/api/products`);
        console.log('📡 Response status:', response.status);
        
        // Get response as text first to check content
        const text = await response.text();
        console.log('📄 Response preview:', text.substring(0, 200));
        
        // Check if it's HTML error page
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          console.error('❌ Server returned HTML error page');
          throw new Error('Backend server returned error page');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse as JSON
        const data = JSON.parse(text);
        console.log('✅ Products loaded:', data);
        
        if (isMounted) {
          setFeatured(data.slice(0, 3));
        }
      } catch (error) {
        console.error('❌ Failed to load products:', error);
        if (isMounted) {
          // Use empty array - don't show error for home page
          setFeatured([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedProducts();
    return () => { isMounted = false; };
  }, []);

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "0.00";
    }
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Electronic Store</h1>
        <p>Loading featured products...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        display: "flex",
        gap: 20,
        alignItems: "center",
        background: "white",
        padding: 24,
        borderRadius: 12,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32 }}>Electronics made simple</h1>
          <p style={{ color: "#475569" }}>
            Clean, reliable and affordable devices for students and IT enthusiasts.
          </p>
          <div style={{ marginTop: 16 }}>
            <Link to="/products" className="button">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginTop: 24 }}>
        <h2>Featured Products</h2>
        {featured.length === 0 ? (
          <div style={{
            background: '#f3f4f6',
            padding: '40px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p>No featured products available at the moment.</p>
            <Link to="/products" className="button" style={{ marginTop: '16px' }}>
              Browse All Products
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
            marginTop: 12,
          }}>
            {featured.map((p) => (
              <div key={p.product_id} style={{ background: "white", padding: 12, borderRadius: 8 }}>
                <img
                  src={getImageUrl(p?.image)}
                  alt={p?.name}
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='140' viewBox='0 0 220 140'%3E%3Crect width='220' height='140' fill='%23f3f4f6'/%3E%3Ctext x='110' y='70' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div style={{ fontWeight: 700, marginTop: 8 }}>{p?.name || "No Name"}</div>
                <div style={{ marginTop: 6 }}>${formatPrice(p?.price)}</div>
                <div style={{ marginTop: 8 }}>
                  <button className="button" onClick={() => addToCart(p)}>Add to Cart</button>
                  <Link to="/products" style={{ marginLeft: 8 }}>View all</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}