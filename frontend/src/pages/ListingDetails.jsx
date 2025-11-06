import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api  from "../lib/api";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        // Adjust this path if your backend uses a different details route
        const res = await api.get(`/listings/${id}`);
        if (!cancelled) setItem(res.data);
      } catch (e) {
        console.error("[Details] failed:", e);
        if (!cancelled) setErr(e?.response?.data?.message || e.message || "Request failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (err) return (
    <div>
      <p style={{ color: "crimson" }}>Failed to load: {err}</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
  if (!item) return <p>Not found.</p>;

  return (
    <div>
      <p><Link to="/browse">← Back to Browse</Link></p>

      <h2 style={{ marginBottom: 0 }}>{item.title}</h2>
      <div style={{ color: "#666", marginTop: 4 }}>
        {item.category} · {item.sellerEmail}
      </div>
      <div style={{ fontWeight: 600, marginTop: 8 }}>${Number(item.price).toFixed(2)}</div>

      {item.description && (
        <p style={{ marginTop: 12 }}>{item.description}</p>
      )}

      {Array.isArray(item.images) && item.images.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {item.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd" }}
            />
          ))}
        </div>
      )}

      {item.createdAt && (
        <div style={{ color: "#777", marginTop: 10, fontSize: 13 }}>
          Created: {new Date(item.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
