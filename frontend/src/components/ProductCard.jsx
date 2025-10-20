import React from 'react';

function ProductsCard({ product }) {
  // 🔗 Your backend base URL (update this when you deploy)
  const BASE_URL = 'http://localhost:5000';

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '16px',
        textAlign: 'center',
        width: '250px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      {/* ✅ Display image from backend */}
      <img
        src={`${BASE_URL}${product.image}`}  // image path comes from your backend
        alt={product.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '10px',
        }}
        onError={(e) => {
          // fallback if image fails to load
          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
        }}
      />

      {/* ✅ Product details */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{product.name}</h3>
      <p style={{ fontSize: '0.9rem', color: '#555', minHeight: '40px' }}>
        {product.description}
      </p>
      <p style={{ fontWeight: 'bold', marginTop: '10px' }}>${product.price}</p>
      <button
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '8px 12px',
          marginTop: '10px',
          cursor: 'pointer',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductsCard;
