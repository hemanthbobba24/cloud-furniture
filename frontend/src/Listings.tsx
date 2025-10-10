import { useEffect, useState } from "react";
import api from "./lib/api";

type Listing = {
  id: string; title: string; description: string; price: number; category: string; images?: string[];
};

export default function Listings(){
  const [q,setQ] = useState("");
  const [items,setItems] = useState<Listing[]>([]);

  async function load(){ 
    const r = await api.get("/api/v1/listings", { params: { q }});
    setItems(r.data);
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{padding:16}}>
      <h2>Listings</h2>
      <input placeholder="search..." value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={load}>Search</button>
      <ul>
        {items.map(it=>(
          <li key={it.id}>
            <b>{it.title}</b> — ${it.price} &middot; {it.category}
            <div style={{opacity:.7}}>{it.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
