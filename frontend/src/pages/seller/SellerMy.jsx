import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api.js";

export default function SellerMy() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/seller/my");
      // Make sure we always set an array
      const data = res.data;
      if (Array.isArray(data)) {
        setListings(data);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("[SellerMy] Error:", err);
      setListings([]); // Set empty array on error
      
      if (err.response?.status === 404) {
        setError(
          "Backend endpoint not found. Please create /api/v1/seller/my endpoint in your Spring Boot backend."
        );
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError(err?.response?.data?.message || err.message || "Failed to load listings");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      await api.delete(`/seller/listings/${id}`);
      alert(`"${title}" deleted successfully!`);
      setListings(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("[SellerMy] Delete error:", err);
      alert(err?.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
        <div style={{ fontSize: 18, marginBottom: 12 }}>Loading your listings...</div>
      </div>
    );
  }

  return (
    <main style={{ padding: "24px 16px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 24 
      }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>My Listings</h1>
        <Link 
          to="/seller/new"
          style={{
            padding: "10px 20px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14
          }}
        >
          + Add New Listing
        </Link>
      </div>

      {error && (
        <div style={{ 
          color: "#b00020", 
          background: "#fee", 
          padding: 16, 
          borderRadius: 8,
          marginBottom: 24,
          border: "1px solid #fca5a5"
        }}>
          <strong>Error:</strong> {error}
          <div style={{ marginTop: 12, fontSize: 13, background: "#fff", padding: 12, borderRadius: 6 }}>
            <strong>To fix this:</strong>
            <ol style={{ margin: "8px 0", paddingLeft: 20 }}>
              <li>Create SellerController.java in your backend</li>
              <li>Add the endpoint: GET /api/v1/seller/my</li>
              <li>Make sure ListingRepository has: findBySellerEmail(String email)</li>
              <li>Restart your Spring Boot application</li>
            </ol>
          </div>
        </div>
      )}

      {!error && listings.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 60,
          background: "#f9fafb",
          borderRadius: 12 
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3 style={{ marginBottom: 8, color: "#374151" }}>No listings yet</h3>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            Create your first listing to start selling!
          </p>
          <Link 
            to="/seller/new"
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
            Create Listing
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
          gap: 20 
        }}>
          {listings.map((item) => (
            <ListingCard 
              key={item.id} 
              item={item} 
              onDelete={handleDelete}
              isDeleting={deleting === item.id}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ListingCard({ item, onDelete, isDeleting }) {
  const navigate = useNavigate();
  const fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80";

  return (
    <article style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      overflow: "hidden",
      background: "#fff",
      transition: "box-shadow 0.2s",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ 
        height: 180, 
        overflow: "hidden",
        background: "#f3f4f6",
        position: "relative"
      }}>
        <img
          src={item.images?.[0] || fallbackImage}
          alt={item.title}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" 
          }}
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        {item.category && (
          <span style={{ 
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.95)",
            padding: "4px 10px",
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase"
          }}>
            {item.category}
          </span>
        )}
      </div>

      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ 
          margin: "0 0 8px", 
          fontSize: 18, 
          fontWeight: 700,
          color: "#111"
        }}>
          {item.title}
        </h3>

        <p style={{ 
          margin: "0 0 12px", 
          color: "#6b7280", 
          fontSize: 14,
          lineHeight: 1.5,
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {item.description || "No description"}
        </p>

        <div style={{ 
          fontSize: 20, 
          fontWeight: 700, 
          color: "#111",
          marginBottom: 16 
        }}>
          ${Number(item.price ?? 0).toFixed(2)}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate(`/seller/edit/${item.id}`)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: "#374151"
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id, item.title)}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: isDeleting ? "#fee" : "#fff",
              border: "1px solid #fca5a5",
              borderRadius: 6,
              cursor: isDeleting ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: "#dc2626"
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}