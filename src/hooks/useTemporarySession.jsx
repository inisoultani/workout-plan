import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useTemporarySession(caller) {
    const navigate = useNavigate();
    const [sessionSet, setSessionSet] = useState(false);
    useEffect(() => {
      console.log("useTemporarySession on ", caller, " called");
      // Parse hash fragment from URL
      const hash = window.location.hash.substring(1); // remove "#"
      const params = new URLSearchParams(hash);
  
      // get the access and refresh tokens from the URL
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
  
      if (access_token && refresh_token) {
          // this will set the session in the context
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(({ error }) => {
          if (error) {
            console.error("Error setting session:", error);
          } else {
            setSessionSet(true);
          }
        });
      } else {
        console.log("No access or refresh token found in URL, navigating to login page");
        navigate("/login");
      }
    }, []);

    return { sessionSet, setSessionSet};
}