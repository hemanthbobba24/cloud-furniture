import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "./AuthContext";

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ListingDetails from "./pages/ListingDetails";
import SellerMy from "./pages/seller/SellerMy";
import SellerNew from "./pages/seller/SellerNew";
import SellerEdit from "./pages/seller/SellerEdit";
import SellerPending from "./pages/seller/SellerPending";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";

function Guard({ roles, element }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return element;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/listing/:id" element={<ListingDetails />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User */}
          <Route path="/cart" element={<Guard roles={["USER"]} element={<Cart />} />} />

          {/* Seller */}
          <Route path="/seller/my" element={<Guard roles={["SELLER"]} element={<SellerMy />} />} />
          <Route path="/seller/new" element={<Guard roles={["SELLER"]} element={<SellerNew />} />} />
          <Route path="/seller/edit/:id" element={<Guard roles={["SELLER"]} element={<SellerEdit />} />} />
          <Route path="/signup/seller-pending" element={<SellerPending />} />

          {/* Admin - FIXED: Changed from /admin/users to /admin */}
          <Route path="/admin" element={<Guard roles={["ADMIN"]} element={<Admin />} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}