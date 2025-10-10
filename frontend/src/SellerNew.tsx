import { useState } from "react";
import api from "./lib/api";

export default function SellerNew(){
  const [title,setTitle] = useState("Wooden Chair");
  const [price,setPrice] = useState(79.99);
  const [category,setCategory] = useState("Chairs");
  const [description,setDescription] = useState("Solid oak");
  const [msg,setMsg] = useState("");

  async function submit(e:React.FormEvent){
    e.preventDefault();
    try{
      const r = await api.post("/api/v1/listings", { title, price, category, description, images: [] });
      setMsg("Created: " + r.data.id);
    }catch(err:any){
      setMsg("Failed: " + (err.response?.status || err.message));
    }
  }

  return (
    <div style={{padding:16}}>
      <h2>New Listing (Seller)</h2>
      <form onSubmit={submit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="title"/><br/>
        <input value={price} onChange={e=>setPrice(parseFloat(e.target.value))} type="number" step="0.01" placeholder="price"/><br/>
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="category"/><br/>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="description"/><br/>
        <button type="submit">Create</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
