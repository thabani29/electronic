import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getImageUrl } from "../utils/api";

// ✅ Define backend API URL (can also come from Vite env)
const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // Debug: Check if environment variable is loading
  console.log('Home Component - API URL:', import.meta.env.VITE_API_URL);
  console.log('Home Component - Using API:', API);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        console.log('Home fetching from:', `${API}/api/products`);
        
        const response = await fetch(`${API}/api/products`);
        console.log('Home - Response status:', response.status);
        
        const text = await response.text();
        console.log('Home - Raw response (first 300 chars):', text.substring(0, 300));
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        
        const data = JSON.parse(text);
        console.log('Home - Parsed data:', data);
        
        // Handle different response structures
        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data && Array.isArray(data.data)) {
          productsArray = data.data;
        } else if (data && data.products) {
          productsArray = Object.values(data.products);
        }
        
        // Clean the data
        const cleanProducts = productsArray.map(product => ({
          product_id: product.product_id || product.id,
          name: product.name || 'Unknown Product',
          price: parseFloat(product.price) || 0,
          image: product.image,
          description: product.description || 'No description available'
        }));

        console.log('Home - Cleaned products:', cleanProducts);
        
        if (isMounted) {
          setFeatured(cleanProducts.slice(0, 3));
        }
      } catch (error) {
        console.error('Home - Detailed fetch error:', error);
        if (isMounted) {
          // Use empty array on error for home page (no error message needed)
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

  // Safe price formatting
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "0.00";
    }
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading featured products...</p>;

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          background: "white",
          padding: 24,
          borderRadius: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32 }}>Electronics made simple</h1>
          <p style={{ color: "#475569" }}>
            Clean, reliable and affordable devices for students and IT
            enthusiasts. Discover laptops, accessories and more.
          </p>
          <div style={{ marginTop: 16 }}>
            <Link to="/products" className="button">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginTop: 24 }}>
        <h2>Featured {featured.length > 0 && `(${featured.length})`}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          {featured.map((p) => (
            <div
              key={p.product_id}
              style={{ background: "white", padding: 12, borderRadius: 8 }}
            >
              <img
                src={getImageUrl(p?.image)}
                alt={p?.name}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/220x140?text=No+Image";
                }}
              />

              <div style={{ fontWeight: 700, marginTop: 8 }}>{p?.name || "No Name"}</div>
              <div style={{ marginTop: 6 }}>${formatPrice(p?.price)}</div>
              <div style={{ marginTop: 8 }}>
                <button className="button" onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
                <Link to="/products" style={{ marginLeft: 8 }}>
                  View all
                </Link>
              </div>
            </div>
          ))}
        </div>
        {featured.length === 0 && !loading && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No featured products available. Check the products page.
          </p>
        )}
      </section>
    </div>
  );
}