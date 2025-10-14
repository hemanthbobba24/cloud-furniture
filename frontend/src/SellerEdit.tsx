import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./lib/api";

export default function SellerEdit(){
  const { id } = useParams();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try{
        const r = await api.get(`/api/v1/listings/${id}`);
        const it = r.data;
        setTitle(it.title);
        setPrice(it.price);
        setCategory(it.category);
        setDescription(it.description);
      }catch(e:any){
        setMsg("Failed to load listing");
      }
    })();
  }, [id]);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    try{
      await api.put(`/api/v1/listings/${id}`, { title, price, category, description });
      setMsg("Saved!");
      setTimeout(()=> nav("/seller/my"), 600);
    }catch(e:any){
      setMsg("Save failed (are you the owner?)");
    }
  }

  return (
    <div style={{padding:16}}>
      <h2>Edit Listing</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={submit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="title" /><br/>
        <input value={price} onChange={e=>setPrice(parseFloat(e.target.value)||0)} type="number" step="0.01" placeholder="price" /><br/>
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="category" /><br/>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="description" /><br/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
