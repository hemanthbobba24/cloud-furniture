import { Link, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App(){
  return (
    <div style={{fontFamily:"sans-serif", padding:16}}>
      <h1>Cloud Furniture</h1>
      <nav style={{display:"flex", gap:12}}>
        <Link to="/">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={() => { localStorage.removeItem("token"); alert("Logged out"); }}>
          Logout
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </div>
  );
}
