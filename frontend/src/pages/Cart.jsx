import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    loadCart();
    
    // Listen for cart updates from other components
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
  }

  function updateQuantity(id, newQty) {
    if (newQty < 1) return;
    
    const updatedCart = items.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    );
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function removeItem(id, title) {
    if (!window.confirm(`Remove "${title}" from cart?`)) return;
    
    const updatedCart = items.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function clearCart() {
    if (!window.confirm("Clear entire cart?")) return;
    
    localStorage.setItem("cart", JSON.stringify([]));
    setItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function handleCheckout() {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // For now, just show a success message
    alert(`Checkout successful!\n\nTotal: $${total.toFixed(2)}\nItems: ${itemCount}\n\nThank you for your purchase!`);
    
    // Clear cart after checkout
    localStorage.setItem("cart", JSON.stringify([]));
    setItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Redirect to home or order confirmation page
    navigate("/");
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = items.length > 0 ? 10 : 0; // $10 flat shipping
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  if (items.length === 0) {
    return (
      <main style={{ 
        maxWidth: 900, 
        margin: "60px auto", 
        padding: "0 16px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
        <h1 style={{ marginBottom: 16, fontSize: 28 }}>Your cart is empty</h1>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 16 }}>
          Browse our products and add items to your cart
        </p>
        <Link 
          to="/browse"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16
          }}
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 32 
      }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
        <button 
          onClick={clearCart}
          style={{
            padding: "8px 16px",
            background: "#fff",
            border: "1px solid #dc2626",
            color: "#dc2626",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14
          }}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Cart Items */}
        <div>
          {items.map((item) => (
            <CartItem 
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ 
          background: "#f9fafb", 
          padding: 24, 
          borderRadius: 12,
          height: "fit-content",
          position: "sticky",
          top: 24
        }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>
            Order Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Shipping</span>
              <span style={{ fontWeight: 600 }}>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Tax (8%)</span>
              <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ 
            borderTop: "2px solid #d1d5db", 
            paddingTop: 16,
            marginBottom: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 700, color: "#111" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: 14,
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 12
            }}
          >
            Proceed to Checkout
          </button>

          <Link 
            to="/browse"
            style={{
              display: "block",
              textAlign: "center",
              color: "#5b21b6",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 14
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

// ============================================
// CartItem Component
// ============================================
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80";
  const itemTotal = Number(item.price) * item.qty;

  return (
    <div style={{ 
      display: "flex",
      gap: 16,
      padding: 16,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      marginBottom: 16
    }}>
      {/* Image */}
      <img 
        src={item.image || fallbackImage}
        alt={item.title}
        style={{
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: 8,
          flexShrink: 0
        }}
        onError={(e) => { e.target.src = fallbackImage; }}
      />

      {/* Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>
          {item.title}
        </h3>
        
        {item.category && (
          <div style={{ 
            fontSize: 12, 
            color: "#6b7280",
            marginBottom: 8,
            textTransform: "uppercase",
            fontWeight: 600
          }}>
            {item.category}
          </div>
        )}

        <div style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 12 }}>
          ${Number(item.price).toFixed(2)} each
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 16,
          marginTop: "auto"
        }}>
          {/* Quantity Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => onUpdateQuantity(item.id, item.qty - 1)}
              disabled={item.qty <= 1}
              style={{
                width: 32,
                height: 32,
                border: "1px solid #d1d5db",
                background: "#fff",
                borderRadius: 6,
                cursor: item.qty <= 1 ? "not-allowed" : "pointer",
                fontSize: 18,
                fontWeight: 600,
                color: item.qty <= 1 ? "#9ca3af" : "#111"
              }}
            >
              −
            </button>
            
            <span style={{ 
              minWidth: 40, 
              textAlign: "center",
              fontWeight: 600,
              fontSize: 16
            }}>
              {item.qty}
            </span>
            
            <button
              onClick={() => onUpdateQuantity(item.id, item.qty + 1)}
              style={{
                width: 32,
                height: 32,
                border: "1px solid #d1d5db",
                background: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 18,
                fontWeight: 600
              }}
            >
              +
            </button>
          </div>

          {/* Item Total */}
          <div style={{ 
            fontSize: 18, 
            fontWeight: 700,
            marginLeft: "auto"
          }}>
            ${itemTotal.toFixed(2)}
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id, item.title)}
            style={{
              padding: "8px 12px",
              background: "#fff",
              border: "1px solid #dc2626",
              color: "#dc2626",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}