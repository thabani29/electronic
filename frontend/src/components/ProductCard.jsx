import React from "react";
import { getImageUrl } from "../utils/api";

export default function ProductCard({ product, onAdd }) {
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "0.00";
    }
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  const safeProduct = {
    name: product?.name || "No Name",
    description: product?.description || "No description available.",
    price: product?.price || 0,
    image: product?.image
  };

  return (
    <div className="product-card" style={{ background: "white", padding: 12, borderRadius: 8 }}>
      <img
        src={getImageUrl(safeProduct.image)}
        alt={safeProduct.name}
        onError={(e) => { 
          // Fallback to Unsplash default image
          e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=220&h=140&fit=crop";
        }}
        style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
      />
      <h3 style={{ marginTop: 8 }}>{safeProduct.name}</h3>
      <p style={{ color: "#555", fontSize: 14 }}>{safeProduct.description}</p>
      <p className="price" style={{ fontWeight: 700 }}>${formatPrice(safeProduct.price)}</p>
      <button 
        className="button" 
        onClick={() => onAdd(product)} 
        style={{ marginTop: 8 }}
      >
        Add to Cart
      </button>
    </div>
  );
}