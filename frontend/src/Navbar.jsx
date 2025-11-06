import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { safeRole } from "./role";

export default function Navbar() {
  const { role: ctxRole, logout, token } = useAuth();
  const role = safeRole(ctxRole || localStorage.getItem("cf_role"));
  const isAuthed = Boolean(token || localStorage.getItem("cf_token"));
  const isUser = role === "USER";
  const isSeller = role === "SELLER";
  const isAdmin = role === "ADMIN";

  const navigate = useNavigate();
  const loc = useLocation();

  const handleLogout = () => {
    logout();
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
        {isUser && <Link to="/cart" style={{ textDecoration: "none", color: "#111" }}>Cart</Link>}
        {isSeller && <Link to="/seller/my" style={{ textDecoration: "none", color: "#111" }}>My Items</Link>}
        {isSeller && <Link to="/seller/new" style={{ textDecoration: "none", color: "#111" }}>Add Item</Link>}
        {/* FIXED: Changed from /admin/users to /admin */}
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
