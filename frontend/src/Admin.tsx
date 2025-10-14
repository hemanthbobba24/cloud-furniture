import { useEffect, useState } from "react";
import api from "./lib/api";

type Listing = { id:string; title:string; price:number; category:string; description:string; sellerEmail:string };
type PageDto<T> = { items:T[]; page:number; size:number; totalItems:number; totalPages:number; sort?:string };
type Stats = { users:number; listings:number };

export default function Admin(){
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState<PageDto<Listing> | null>(null);
  const [error, setError] = useState("");

  async function load(){
    try{
      const s = await api.get("/api/v1/admin/stats");
      setStats(s.data);
      const r = await api.get("/api/v1/admin/listings", { params: { q, page, size, sort }});
      setData(r.data);
    }catch{
      setError("Forbidden? You need ADMIN role. Log out & back in if you just promoted.");
    }
  }

  async function del(id:string){
    if(!confirm("Delete listing "+id+"?")) return;
    await api.delete(`/api/v1/admin/listings/${id}`);
    load();
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{padding:16}}>
      <h2>Admin Console</h2>
      {error && <p style={{color:"crimson"}}>{error}</p>}
      <div style={{display:"flex", gap:16}}>
        <div><b>Users:</b> {stats?.users ?? "-"}</div>
        <div><b>Listings:</b> {stats?.listings ?? "-"}</div>
      </div>

      <div style={{marginTop:16, display:"flex", gap:8, flexWrap:"wrap"}}>
        <input placeholder="search title/description..." value={q} onChange={e=>setQ(e.target.value)} />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="createdAt,desc">Newest</option>
          <option value="price,asc">Price ↑</option>
          <option value="price,desc">Price ↓</option>
          <option value="title,asc">Title A→Z</option>
        </select>
        <select value={String(size)} onChange={e=>setSize(parseInt(e.target.value))}>
          <option value="10">10</option><option value="20">20</option><option value="50">50</option>
        </select>
        <button onClick={()=>{ setPage(0); load(); }}>Search</button>
      </div>

      <ul style={{marginTop:12}}>
        {data?.items.map(it=>(
          <li key={it.id} style={{marginBottom:10}}>
            <b>{it.title}</b> — ${it.price} · {it.category} · <i>{it.sellerEmail}</i>
            <div style={{opacity:.7}}>{it.description}</div>
            <div style={{display:"flex", gap:8, marginTop:4}}>
              <button onClick={()=>del(it.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <button disabled={!data || page<=0} onClick={()=>{ setPage(p=>p-1); setTimeout(load,0); }}>Prev</button>
        <span>Page {page+1} / {data ? Math.max(1, data.totalPages) : 1}</span>
        <button disabled={!data || !data.totalPages || page>=data.totalPages-1}
                onClick={()=>{ setPage(p=>p+1); setTimeout(load,0); }}>Next</button>
      </div>
    </div>
  );
}
