import { useState } from "react";
import api from "./lib/api";

export default function Dashboard(){
  const [me,setMe]=useState<any>(null);
  const [seller,setSeller]=useState<string>("");

  async function loadMe(){
    const r = await api.get("/api/v1/auth/me");
    setMe(r.data);
  }
  async function pingSeller(){
    try{
      const r = await api.get("/api/v1/seller/ping");
      setSeller(r.data);
    }catch(err:any){
      setSeller("Forbidden or not logged in");
    }
  }

  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h2>Dashboard</h2>
      <button onClick={loadMe}>Load /me</button>
      <pre>{me ? JSON.stringify(me,null,2) : ""}</pre>

      <button onClick={pingSeller}>Try seller ping</button>
      <p>{seller}</p>
    </div>
  );
}
