import React from "react";
import { Link } from "react-router-dom";

export default function SellerPending() {
  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "60px auto", 
      padding: 24,
      textAlign: "center" 
    }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>⏳</div>
      <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 700 }}>
        Seller Request Pending
      </h2>
      <p style={{ color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
        Your seller request has been sent to the admin for approval. 
        You can continue browsing as a user. Once approved, you'll be able to create listings.
      </p>
      <Link 
        to="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "#111",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 8,
          fontWeight: 600
        }}
      >
        Go to Home
      </Link>
    </div>
  );
}