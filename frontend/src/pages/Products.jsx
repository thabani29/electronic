import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { getApiUrl } from "../utils/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const API = getApiUrl();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted) setProducts(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [API]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading products...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: 40, color: "#d32f2f" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Products ({products.length})</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20
      }}>
        {products.map((p) => (
          <ProductCard key={p.product_id} product={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  );
}
