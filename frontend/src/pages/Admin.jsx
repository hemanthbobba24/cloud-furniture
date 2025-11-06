import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function Admin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/seller-requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("[Admin] Failed to load requests:", err);
      setError("Failed to load seller requests");
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    try {
      await api.post(`/admin/approve-seller/${id}`);
      alert("Seller approved successfully");
      await loadRequests();
    } catch (err) {
      console.error("[Admin] Failed to approve:", err);
      alert("Failed to approve seller");
    }
  }

  useEffect(() => { 
    loadRequests(); 
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <h2>Admin - Seller Requests</h2>
      
      {error && (
        <div style={{ color: "#b00020", padding: 10, background: "#fee", borderRadius: 6, marginBottom: 16 }}>
          {error}
        </div>
      )}
      
      {requests.length === 0 ? (
        <p>No pending seller requests.</p>
      ) : (
        <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
          {requests.map((r, idx) => (
            <div 
              key={r.id} 
              style={{ 
                display: "flex", 
                gap: 12, 
                alignItems: "center", 
                padding: 16,
                borderBottom: idx < requests.length - 1 ? "1px solid #eee" : "none",
                background: "#fff"
              }}
            >
              <span style={{ flex: 1, fontWeight: 500 }}>{r.email}</span>
              <button 
                onClick={() => approve(r.id)}
                style={{
                  padding: "8px 16px",
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}