import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function RequestSeller() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const res = await api.get("/seller-request/my-status");
      setStatus(res.data);
      
      // If already seller, redirect
      if (res.data.currentRole === "SELLER") {
        navigate("/seller/my");
      }
    } catch (err) {
      console.error("[RequestSeller] Status check error:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/seller-request/submit", { message });
      setSuccess(true);
      setMessage("");
      
      // Refresh status
      setTimeout(() => {
        checkStatus();
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  if (status?.hasPendingRequest) {
    return (
      <main style={{ maxWidth: 600, margin: "60px auto", padding: "0 16px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>⏳</div>
        <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 700 }}>
          Seller Request Pending
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
          Your seller request has been submitted and is awaiting admin approval.
          You'll be notified once it's been reviewed.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: "60px auto", padding: "0 16px" }}>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 32
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            Request Seller Access
          </h2>
          <p style={{ color: "#6b7280", marginTop: 8 }}>
            Tell us why you'd like to become a seller on Cloud Furniture
          </p>
        </div>

        {error && (
          <div style={{
            color: "#b00020",
            background: "#fee",
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #fca5a5"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: "#065f46",
            background: "#d1fae5",
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #6ee7b7"
          }}>
            ✓ Request submitted successfully! Awaiting admin approval.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#374151"
            }}>
              Why do you want to become a seller? (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Tell us about the products you'd like to sell..."
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 14,
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: "100%",
              padding: 14,
              background: loading || success ? "#9ca3af" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: loading || success ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 16
            }}
          >
            {loading ? "Submitting..." : success ? "Request Submitted!" : "Submit Request"}
          </button>
        </form>
      </div>
    </main>
  );
}