import { Link, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Listings from "./Listings";
import SellerNew from "./SellerNew";
import SellerMy from "./SellerMy";
import SellerEdit from "./SellerEdit";
import Admin from "./Admin";

export default function App(){
  return (
    <div style={{fontFamily:"sans-serif", padding:16}}>
      <h1>Cloud Furniture</h1>
      <nav style={{display:"flex", gap:12, flexWrap:"wrap"}}>
        <Link to="/">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/listings">Browse</Link>
        <Link to="/seller/new">Seller: New</Link>
        <Link to="/seller/my">Seller: My Listings</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={() => { localStorage.removeItem("token"); alert("Logged out"); }}>
          Logout
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/listings" element={<Listings/>}/>
        <Route path="/seller/new" element={<SellerNew/>}/>
        <Route path="/seller/my" element={<SellerMy/>}/>
        <Route path="/seller/edit/:id" element={<SellerEdit/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </div>
  );
}
