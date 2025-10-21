import React from "react";
import { getImageUrl } from "../utils/api";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="product-card" style={{ background: "white", padding: 12, borderRadius: 8 }}>
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        onError={(e) => { e.target.src = "https://via.placeholder.com/220x140?text=No+Image"; }}
        style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
      />
      <h3 style={{ marginTop: 8 }}>{product.name}</h3>
      <p style={{ color: "#555", fontSize: 14 }}>{product.description || "No description available."}</p>
      <p className="price" style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</p>
      <button className="button" onClick={() => onAdd(product)} style={{ marginTop: 8 }}>Add to Cart</button>
    </div>
  );
}
