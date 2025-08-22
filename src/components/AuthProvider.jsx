import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export const AuthProvider = ({ children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
      console.log("useEffect AuthProvider called");
      supabase.auth.getSession().then(({ data: { session }}) => {
          setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
              setUser(session?.user ?? null);
          }
      );

      return () => {
          subscription.unsubscribe();
      }
  }, []);

  return (
      <AuthContext.Provider value={ { user, setUser } }>
          {children}
      </AuthContext.Provider>
  );
};