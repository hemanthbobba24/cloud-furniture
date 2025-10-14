import { useEffect, useState } from "react";
import api from "./lib/api";

type Listing = {
  id: string; title: string; description: string; price: number; category: string; images?: string[];
};
type PageDto<T> = { items:T[]; page:number; size:number; totalItems:number; totalPages:number; sort?:string };

export default function Listings(){
  const [q,setQ] = useState("");
  const [sort,setSort] = useState("createdAt,desc");
  const [page,setPage] = useState(0);
  const [size,setSize] = useState(5);
  const [data,setData] = useState<PageDto<Listing> | null>(null);

  async function load(p=page){
    const r = await api.get("/api/v1/listings", { params: { q, page:p, size, sort }});
    setData(r.data);
    setPage(r.data.page);
  }

  useEffect(()=>{ load(0); }, []);         // initial

  function applySearch(){ load(0); }       // reset to first page
  function prev(){ if(page>0) load(page-1); }
  function next(){ if(data && page < data.totalPages-1) load(page+1); }

  return (
    <div style={{padding:16}}>
      <h2>Listings</h2>
      <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center"}}>
        <input placeholder="search..." value={q} onChange={e=>setQ(e.target.value)} />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="createdAt,desc">Newest</option>
          <option value="price,asc">Price: Low → High</option>
          <option value="price,desc">Price: High → Low</option>
          <option value="title,asc">Title A→Z</option>
        </select>
        <select value={String(size)} onChange={e=>setSize(parseInt(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <button onClick={applySearch}>Search</button>
      </div>

      <ul>
        {data?.items.map(it=>(
          <li key={it.id} style={{marginBottom:8}}>
            <b>{it.title}</b> — ${it.price} · {it.category}
            <div style={{opacity:.7}}>{it.description}</div>
          </li>
        ))}
      </ul>

      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <button onClick={prev} disabled={!data || page<=0}>Prev</button>
        <span>Page {page+1} / {data ? Math.max(1, data.totalPages) : 1}</span>
        <button onClick={next} disabled={!data || page >= (data.totalPages-1)}>Next</button>
      </div>
    </div>
  );
}
