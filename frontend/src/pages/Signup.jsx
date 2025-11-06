import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await signup(email.trim(), password, role);
      
      // Show success message
      setSuccess(true);
      
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        nav("/login");
      }, 2000);
      
    } catch (ex) {
      setError(ex?.response?.data?.message || ex?.message || "Signup failed");
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
      <h1>Sign up</h1>
      
      {error && (
        <div style={{ 
          color: "#b00020", 
          marginBottom: 16, 
          padding: 12, 
          background: "#fee", 
          borderRadius: 8,
          border: "1px solid #fca5a5"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          color: "#065f46", 
          marginBottom: 16, 
          padding: 12, 
          background: "#d1fae5", 
          borderRadius: 8,
          border: "1px solid #6ee7b7",
          fontWeight: 500
        }}>
          ✓ Account created successfully! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={busy || success}
            style={{ 
              width: "100%", 
              padding: 10, 
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength="6"
            disabled={busy || success}
            style={{ 
              width: "100%", 
              padding: 10, 
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            minLength="6"
            disabled={busy || success}
            style={{ 
              width: "100%", 
              padding: 10, 
              borderRadius: 6,
              border: confirmPassword && password !== confirmPassword 
                ? "1px solid #b00020" 
                : "1px solid #d1d5db",
              fontSize: 14
            }}
          />
          {confirmPassword && password !== confirmPassword && (
            <div style={{ 
              color: "#b00020", 
              fontSize: 12, 
              marginTop: 4 
            }}>
              Passwords do not match
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
            Sign up as
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={busy || success}
            style={{ 
              width: "100%", 
              padding: 10, 
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14
            }}
          >
            <option value="USER">USER</option>
            <option value="SELLER">SELLER</option>
          </select>
        </div>

        <button 
          disabled={busy || success} 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: 12,
            background: busy || success ? "#9ca3af" : "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: busy || success ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 14
          }}
        >
          {busy ? "Creating account..." : success ? "Success!" : "Create account"}
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
        Have an account? <Link to="/login" style={{ color: "#5b21b6", fontWeight: 500 }}>Login</Link>
      </div>
    </div>
  );
}