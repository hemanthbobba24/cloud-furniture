import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { safeRole } from "./role";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { role: ctxRole, logout, token } = useAuth();
  const role = safeRole(ctxRole || localStorage.getItem("cf_role"));
  const isAuthed = Boolean(token || localStorage.getItem("cf_token"));
  const isUser = role === "USER";
  const isSeller = role === "SELLER";
  const isAdmin = role === "ADMIN";

  const navigate = useNavigate();
  const loc = useLocation();

  const [cartCount, setCartCount] = useState(0);

  // Update cart count
  useEffect(() => {
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(total);
  }

  const handleLogout = () => {
    logout();
    // Clear cart on logout
    localStorage.removeItem("cart");
    setCartCount(0);
    if (loc.pathname !== "/browse") navigate("/browse");
  };

  return (
    <header style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      padding:"16px 20px",
      borderBottom:"1px solid #eee",
      background: "#fff"
    }}>
      <Link to="/" style={{ 
        fontWeight: 700, 
        textDecoration: "none", 
        color: "#4b2aad",
        fontSize: 18
      }}>
        Cloud Furniture
      </Link>

      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/browse" style={{ textDecoration: "none", color: "#111" }}>Browse</Link>
        
        {isUser && (
          <Link to="/cart" style={{ 
            textDecoration: "none", 
            color: "#111",
            position: "relative"
          }}>
            Cart
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: -8,
                right: -12,
                background: "#dc2626",
                color: "#fff",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        )}
        
        {isSeller && <Link to="/seller/my" style={{ textDecoration: "none", color: "#111" }}>My Items</Link>}
        {isSeller && <Link to="/seller/new" style={{ textDecoration: "none", color: "#111" }}>Add Item</Link>}
        {isAdmin && <Link to="/admin" style={{ textDecoration: "none", color: "#111" }}>Admin</Link>}

        {!isAuthed ? (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "#5b21b6" }}>Login</Link>
            <Link to="/signup" style={{ textDecoration: "none", color: "#5b21b6" }}>Sign up</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ 
            padding: "8px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500
          }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}