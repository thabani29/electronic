import React from "react";

export default function ProductCard({ product, onAdd }) {
  const backendBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Use the EXACT same image logic as your Home page
  const imageSrc = (product.image || product.image_url)?.startsWith("http")
    ? (product.image || product.image_url) // full URL already
    : `${backendBase}/uploads/${(product.image || product.image_url)?.replace(/^uploads[\\/]/, "")}`;

  return (
    <div className="product-card">
      <img 
        src={imageSrc}
        alt={product.name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/220x140?text=No+Image";
        }}
        style={{ 
          width: '100%',
          height: '140px',
          objectFit: 'cover',
          borderRadius: '6px' // Added to match Home page
        }}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button className="button" onClick={() => onAdd(product)}>
        Add to Cart
      </button>
    </div>
  );
}