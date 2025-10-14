import { useEffect, useState } from "react";
import api from "./lib/api";

type Listing = {
  id: string; title: string; description: string; price: number; category: string;
};

export default function SellerMy(){
  const [items, setItems] = useState<Listing[]>([]);
  const [msg, setMsg] = useState("");

  async function load(){
    try{
      const r = await api.get("/api/v1/seller/my-listings");
      setItems(r.data);
    }catch(e:any){
      setMsg("Failed to load (are you logged in as SELLER?)");
    }
  }

  async function del(id: string){
    if(!confirm("Delete this listing?")) return;
    try{
      await api.delete(`/api/v1/listings/${id}`);
      setItems(prev => prev.filter(x => x.id !== id));
    }catch(e:any){
      alert("Delete failed");
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{padding:16}}>
      <h2>My Listings</h2>
      {msg && <p>{msg}</p>}
      <ul>
        {items.map(it => (
          <li key={it.id} style={{marginBottom:8}}>
            <b>{it.title}</b> — ${it.price} · {it.category}
            <div style={{opacity:.7}}>{it.description}</div>
            <div style={{display:"flex", gap:8, marginTop:6}}>
              <a href={`/seller/edit/${it.id}`}>Edit</a>
              <button onClick={()=>del(it.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p>No listings yet.</p>}
    </div>
  );
}
