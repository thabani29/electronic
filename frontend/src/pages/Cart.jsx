import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { getApiUrl, getImageUrl } from "../utils/api";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const API = getApiUrl();

  // Debug: Check if environment variable is loading
  console.log('Cart Component - API URL:', import.meta.env.VITE_API_URL);
  console.log('Cart Component - Using API:', API);

  // Safe total calculation
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item?.price) || 0;
    const quantity = parseInt(item?.qty) || 0;
    return sum + (price * quantity);
  }, 0).toFixed(2);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Cart is empty" });
      return;
    }
    setLoading(true);
    setMessage(null);
    
    try {
      console.log('Cart - Checkout to:', `${API}/api/orders`);
      
      const response = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: null, 
          total: parseFloat(total), 
          items: cart.map(item => ({
            product_id: item?.product_id,
            name: item?.name || "Unknown Product",
            price: parseFloat(item?.price) || 0,
            qty: parseInt(item?.qty) || 1,
            image: item?.image
          }))
        }),
      });
      
      console.log('Checkout - Response status:', response.status);
      
      const text = await response.text();
      console.log('Checkout - Raw response:', text.substring(0, 500));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      
      const data = JSON.parse(text);
      console.log('Checkout - Parsed data:', data);
      
      setMessage({ 
        type: "success", 
        text: `Order placed! Order ID: ${data.orderId || data.id || "N/A"}` 
      });
      clearCart();
    } catch (err) {
      console.error("Checkout - Detailed error:", err);
      setMessage({ 
        type: "error", 
        text: "Network or server error. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe item total calculation
  const getItemTotal = (item) => {
    const price = parseFloat(item?.price) || 0;
    const quantity = parseInt(item?.qty) || 0;
    return (price * quantity).toFixed(2);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Cart</h2>
      
      {message && (
        <div style={{
          marginBottom: 12,
          padding: 10,
          borderRadius: 8,
          background: message.type === "success" ? "#ddffef" : "#ffecec",
          color: message.type === "success" ? "#027a4d" : "#b91c1c",
          border: `1px solid ${message.type === "success" ? "#027a4d" : "#b91c1c"}`
        }}>
          {message.text}
        </div>
      )}

      {cart.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px",
          background: "white",
          borderRadius: 8
        }}>
          <p style={{ fontSize: "1.1em", color: "#666", marginBottom: 16 }}>
            Your cart is empty
          </p>
          <a href="/products" className="button">
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          {cart.map((item) => {
            const safeItem = {
              id: item?.product_id || item?.id,
              name: item?.name || "Unknown Product",
              price: parseFloat(item?.price) || 0,
              qty: parseInt(item?.qty) || 1,
              image: item?.image
            };
            
            return (
              <div 
                key={safeItem.id} 
                style={{ 
                  display: "flex", 
                  gap: 16, 
                  alignItems: "center", 
                  marginBottom: 16, 
                  background: "white", 
                  padding: 16, 
                  borderRadius: 8,
                  border: "1px solid #e5e5e5"
                }}
              >
                <img 
                  src={getImageUrl(safeItem.image)} 
                  alt={safeItem.name} 
                  style={{ 
                    width: 80, 
                    height: 80, 
                    objectFit: "cover", 
                    borderRadius: 6 
                  }} 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1em", marginBottom: 4 }}>
                    {safeItem.name}
                  </div>
                  <div style={{ color: "#666", marginBottom: 8 }}>
                    ${safeItem.price.toFixed(2)} each
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>Qty:</span>
                      <input 
                        type="number" 
                        value={safeItem.qty} 
                        min={1} 
                        max={99}
                        onChange={(e) => updateQty(safeItem.id, Math.max(1, parseInt(e.target.value || "1")))} 
                        style={{ 
                          width: 70, 
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: 4,
                          textAlign: "center"
                        }} 
                      />
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(safeItem.id)} 
                      style={{ 
                        padding: "6px 12px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: "0.9em"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: "1.1em",
                  minWidth: 80,
                  textAlign: "right"
                }}>
                  ${getItemTotal(item)}
                </div>
              </div>
            );
          })}
          
          {/* Order Summary */}
          <div style={{ 
            background: "white", 
            padding: 20, 
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            marginTop: 20
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 16
            }}>
              <span style={{ fontSize: "1.2em", fontWeight: 700 }}>Total:</span>
              <span style={{ fontSize: "1.5em", fontWeight: 800, color: "#1f2937" }}>
                ${total}
              </span>
            </div>
            
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button 
                className="button" 
                onClick={handleCheckout} 
                disabled={loading || cart.length === 0}
                style={{
                  padding: "12px 24px",
                  fontSize: "1.1em",
                  background: loading ? "#9ca3af" : "#3b82f6",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Processing..." : "Checkout Now"}
              </button>
              
              <button 
                onClick={clearCart} 
                style={{ 
                  padding: "12px 24px",
                  background: "transparent",
                  color: "#6b7280",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "1.1em"
                }}
                disabled={cart.length === 0}
              >
                Clear Cart
              </button>
            </div>
            
            {cart.length > 0 && (
              <p style={{ 
                marginTop: 12, 
                fontSize: "0.9em", 
                color: "#6b7280",
                fontStyle: "italic"
              }}>
                {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}