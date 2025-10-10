import { useState } from "react";
import api from "./lib/api";

export default function Login(){
  const [email,setEmail]=useState("alice@example.com");
  const [password,setPassword]=useState("pass123");
  const [msg,setMsg]=useState("");

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setMsg("Logging in...");
    try{
      const r = await api.post("/api/v1/auth/login", { email, password });
      localStorage.setItem("token", r.data.accessToken);
      setMsg("Logged in! Token saved.");
    }catch(err:any){
      setMsg("Login failed: " + (err.response?.status || err.message));
    }
  }

  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /><br/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" /><br/>
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
      <p style={{opacity:.7}}>Try seller@example.com / pass123 after you sign it up.</p>
    </div>
  );
}
