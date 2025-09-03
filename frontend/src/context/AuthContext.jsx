// Authentication context provider - manages user login state across the app
import React, { useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app initialization
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        // Fetch current user from server using JWT cookie
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        const data = await res.json();
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch {
        // Handle fetch errors (network issues, etc.)
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    }
    
    load();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      cancelled = true;
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
