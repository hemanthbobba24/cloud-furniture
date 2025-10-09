import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [msg, setMsg] = useState("Loading...");
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/health")
      .then(r => setMsg(JSON.stringify(r.data)))
      .catch(e => setMsg("API not reachable: " + e.message));
  }, []);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Cloud Furniture – Frontend</h1>
      <p>Backend health: {msg}</p>
    </div>
  );
}
