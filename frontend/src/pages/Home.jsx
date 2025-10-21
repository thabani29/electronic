import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getApiUrl, getImageUrl } from "../utils/api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const API = getApiUrl();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFeatured(data.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [API]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading featured products...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: 40, color: "#d32f2f" }}>{error}</p>;

  return (
    <div>
      <section style={{ padding: 24, borderRadius: 12, background: "white" }}>
        <h1 style={{ fontSize: 32 }}>Electronics made simple</h1>
        <p style={{ color: "#475569" }}>
          Clean, reliable and affordable devices for students and IT enthusiasts. Discover laptops, accessories and more.
        </p>
        <div style={{ marginTop: 16 }}>
          <Link to="/products" className="button">Shop Now</Link>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Featured</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
          marginTop: 12,
        }}>
          {featured.map((p) => (
            <div key={p.product_id} style={{ background: "white", padding: 12, borderRadius: 8 }}>
              <img
                src={getImageUrl(p.image)}
                alt={p.name}
                style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
              />
              <div style={{ fontWeight: 700, marginTop: 8 }}>{p.name}</div>
              <div style={{ marginTop: 6 }}>${p.price.toFixed(2)}</div>
              <div style={{ marginTop: 8 }}>
                <button className="button" onClick={() => addToCart(p)}>Add to Cart</button>
                <Link to="/products" style={{ marginLeft: 8 }}>View all</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
