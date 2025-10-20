import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API}/api/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Enhanced loading component
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ 
          fontSize: "18px", 
          marginBottom: "10px" 
        }}>
          Loading products...
        </div>
        <div style={{ 
          display: "inline-block",
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center",
        color: "#d32f2f"
      }}>
        <h3>Error loading products</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ 
        marginBottom: "16px",
        color: "#333",
        fontSize: "24px",
        fontWeight: "600"
      }}>
        Products ({products.length})
      </h2>

      {products.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          color: "#666"
        }}>
          <h3>No products found</h3>
          <p>Check back later for new products.</p>
        </div>
      ) : (
        <div
          className="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
            opacity: loading ? 0.5 : 1,
            transition: "opacity 0.3s ease-in",
          }}
        >
          {products.map((product) => (
            <ProductCard 
              key={product.product_id} 
              product={product} 
              onAdd={addToCart} 
            />
          ))}
        </div>
      )}
    </div>
  );
}