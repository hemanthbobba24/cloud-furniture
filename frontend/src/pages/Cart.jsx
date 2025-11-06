// src/pages/Cart.jsx
import { useMemo, useState } from "react";

export default function Cart() {
  const [bump, setBump] = useState(0);
  const items = useMemo(() => JSON.parse(localStorage.getItem("cart") || "[]"), [bump]);

  const remove = (id) => {
    const next = items.filter((x) => x.id !== id);
    localStorage.setItem("cart", JSON.stringify(next));
    setBump((n) => n + 1);
  };

  const total = items.reduce((s, x) => s + (Number(x.price) || 0), 0);

  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <h1>My cart</h1>
      {!items.length && <p>Your cart is empty.</p>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {items.map((it) => (
          <li key={it.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, display: "flex", gap: 12 }}>
            <img src={it.image} alt={it.title} width="80" height="80" style={{ objectFit: "cover", borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.title}</div>
              <div>${Number(it.price).toFixed(2)}</div>
            </div>
            <button onClick={() => remove(it.id)}>Remove</button>
          </li>
        ))}
      </ul>

      {!!items.length && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>Total: ${total.toFixed(2)}</strong>
          <button onClick={() => alert("Checkout demo")}>Checkout</button>
        </div>
      )}
    </main>
  );
}
