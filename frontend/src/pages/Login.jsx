import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email.trim(), password, role);
      // redirect by role
      if (role === "SELLER") nav("/seller/my");
      else if (role === "ADMIN") nav("/admin");
      else nav("/browse");
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Invalid email/password/role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
      <h1>Login</h1>
      {err && (
        <div style={{ color: "#b00020", marginBottom: 10, padding: 10, background: "#fee", borderRadius: 6 }}>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />

        <label>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", marginBottom: 16, padding: 8 }}
        >
          <option value="USER">USER</option>
          <option value="SELLER">SELLER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button disabled={loading} type="submit" style={{ width: "100%", padding: 10, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 12, textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}