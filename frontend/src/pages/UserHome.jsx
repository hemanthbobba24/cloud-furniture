// src/pages/UserHome.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import api from "../lib/api";

export default function UserHome() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        // keep it simple; adjust if your backend needs page/size params
        const res = await api.get("/listings?size=24&page=0");
        if (!ignore) {
          const data = Array.isArray(res.data?.items) ? res.data.items : res.data;
          setItems(data || []);
        }
      } catch (e) {
        setErr("Failed to load listings.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  function addToCart(item) {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    // store a minimal snapshot for the cart
    const snapshot = {
      id: item.id,
      title: item.title,
      price: item.price,
      image: (item.images && item.images[0]) || "",
      qty: 1,
    };

    // if already in cart, just bump qty
    const idx = cart.findIndex(c => c.id === snapshot.id);
    if (idx >= 0) cart[idx].qty += 1;
    else cart.push(snapshot);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added "${item.title}" to cart`);
  }

  if (loading) return <div style={{ padding: 18 }}>Loading…</div>;
  if (err) return <div style={{ padding: 18, color: "crimson" }}>{err}</div>;

  return (
    <div style={{ padding: "18px 18px 40px" }}>
      <h2 style={{ margin: "8px 0 18px" }}>
        {role === "USER" ? "Browse Furniture" : "Browse"}
      </h2>

      {items.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        <div style={grid}>
          {items.map((l) => (
            <article key={l.id} style={card}>
              <div style={imgWrap}>
                <img
                  src={(l.images && l.images[0]) || placeholder}
                  alt={l.title}
                  style={img}
                />
              </div>
              <div style={body}>
                <h3 style={title}>{l.title}</h3>
                <p style={desc}>{(l.description || "").slice(0, 80) || "—"}</p>
                <div style={row}>
                  <span style={price}>${Number(l.price).toFixed(2)}</span>
                  <button onClick={() => addToCart(l)} style={btn}>
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const placeholder =
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=60&auto=format&fit=crop";

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 16,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 12,
  overflow: "hidden",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
};

const imgWrap = { aspectRatio: "4/3", overflow: "hidden", background: "#fafafa" };
const img = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

const body = { padding: 12, display: "flex", flexDirection: "column", gap: 8 };
const title = { margin: 0, fontSize: 16 };
const desc = { margin: 0, color: "#555", fontSize: 13, minHeight: 36, lineHeight: 1.25 };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const price = { fontWeight: 700 };
const btn = {
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};
