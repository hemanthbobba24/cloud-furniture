import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./lib/api";
import { safeRole, normalizeRole } from "./role";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // sanitize persisted values at boot
  const bootToken = localStorage.getItem("cf_token") || "";
  const bootEmail = localStorage.getItem("cf_email") || "";
  const bootRole = safeRole(localStorage.getItem("cf_role"));

  const [auth, setAuth] = useState({ token: bootToken, email: bootEmail, role: bootRole });
  const [hydrating, setHydrating] = useState(false);

  // keep axios header synced
  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [auth.token]);

  // Auto-hydrate role from /auth/me if token exists but role is missing
  useEffect(() => {
    async function hydrateRole() {
      if (auth.token && !auth.role && !hydrating) {
        setHydrating(true);
        try {
          const res = await api.get("/auth/me");
          const serverRole = safeRole(res.data?.role);
          if (serverRole) {
            localStorage.setItem("cf_role", serverRole);
            setAuth(prev => ({ ...prev, role: serverRole }));
          }
        } catch (err) {
          console.error("[Auth] Role hydration failed:", err);
          // If /auth/me fails with 401, token is invalid - clear everything
          if (err.response?.status === 401) {
            localStorage.removeItem("cf_token");
            localStorage.removeItem("cf_email");
            localStorage.removeItem("cf_role");
            setAuth({ token: "", email: "", role: "" });
          }
        } finally {
          setHydrating(false);
        }
      }
    }
    hydrateRole();
  }, [auth.token, auth.role, hydrating]);

  // one-time storage cleanup on mount
  useEffect(() => {
    if (bootRole !== (localStorage.getItem("cf_role") || "")) {
      if (bootRole) localStorage.setItem("cf_role", bootRole);
      else localStorage.removeItem("cf_role");
    }
  }, []); // eslint-disable-line

  // listen for external storage changes (other tabs / rogue code)
  useEffect(() => {
    const onStorage = () => {
      const freshRole = safeRole(localStorage.getItem("cf_role"));
      if (freshRole !== auth.role) {
        setAuth((a) => ({ ...a, role: freshRole }));
      }
      const freshToken = localStorage.getItem("cf_token") || "";
      const freshEmail = localStorage.getItem("cf_email") || "";
      if (freshToken !== auth.token || freshEmail !== auth.email) {
        setAuth((a) => ({ ...a, token: freshToken, email: freshEmail }));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [auth.role, auth.token, auth.email]);

  const login = async (email, password, role) => {
    const desired = normalizeRole(role);
    const res = await api.post("/auth/login", { email, password, role: desired });

    const token = res.data?.accessToken || res.data?.token || "";
    const serverRole = safeRole(res.data?.role);

    if (!token) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("cf_token", token);
    localStorage.setItem("cf_email", email);
    
    if (serverRole) {
      localStorage.setItem("cf_role", serverRole);
    } else {
      localStorage.removeItem("cf_role");
    }

    setAuth({ token, email, role: serverRole });
    return res.data;
  };

  const signup = async (email, password, role) => {
    const body = { email, password, role: normalizeRole(role) };
    const res = await api.post("/auth/signup", body, { 
      headers: { "Content-Type": "application/json" } 
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_email");
    localStorage.removeItem("cf_role");
    delete api.defaults.headers.common.Authorization;
    setAuth({ token: "", email: "", role: "" });
  };

  const value = useMemo(() => ({ 
    ...auth, 
    login, 
    signup, 
    logout,
    isHydrating: hydrating 
  }), [auth, hydrating]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
