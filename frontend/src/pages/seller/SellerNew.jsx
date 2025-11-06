import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function SellerNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    imagesCsv: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        images: form.imagesCsv
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await api.post("/listings", payload);
      alert("Listing created successfully!");
      navigate("/seller/my");
    } catch (err) {
      console.error("[SellerNew] Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to create listing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ padding: "24px 16px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link 
          to="/seller/my"
          style={{ 
            color: "#5b21b6", 
            textDecoration: "none",
            fontWeight: 500
          }}
        >
          ← Back to My Listings
        </Link>
      </div>

      <h1 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700 }}>
        Create New Listing
      </h1>

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

      <form onSubmit={onSubmit} style={{ 
        background: "#fff", 
        padding: 24, 
        borderRadius: 12,
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 6, 
            fontWeight: 600,
            color: "#374151"
          }}>
            Title *
          </label>
          <input 
            name="title" 
            value={form.title} 
            onChange={onChange} 
            placeholder="e.g., Modern Oak Coffee Table"
            required
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 6, 
            fontWeight: 600,
            color: "#374151"
          }}>
            Description
          </label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={onChange} 
            rows={5}
            placeholder="Describe your product..."
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

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 6, 
            fontWeight: 600,
            color: "#374151"
          }}>
            Category
          </label>
          <input 
            name="category" 
            value={form.category} 
            onChange={onChange}
            placeholder="e.g., Tables, Chairs, Sofas"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 6, 
            fontWeight: 600,
            color: "#374151"
          }}>
            Price (USD) *
          </label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            value={form.price} 
            onChange={onChange}
            placeholder="0.00"
            required
            min="0.01"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 6, 
            fontWeight: 600,
            color: "#374151"
          }}>
            Image URLs
          </label>
          <input 
            name="imagesCsv" 
            value={form.imagesCsv} 
            onChange={onChange}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14
            }}
          />
          <div style={{ 
            fontSize: 12, 
            color: "#6b7280", 
            marginTop: 6 
          }}>
            Separate multiple URLs with commas
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button 
            type="button"
            onClick={() => navigate("/seller/my")}
            style={{
              flex: 1,
              padding: 12,
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: "#374151"
            }}
          >
            Cancel
          </button>
          <button 
            disabled={saving} 
            type="submit"
            style={{
              flex: 2,
              padding: 12,
              background: saving ? "#9ca3af" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            {saving ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
